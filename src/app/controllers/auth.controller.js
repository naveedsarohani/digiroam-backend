import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as AppleStrategy } from "passport-apple"

import emailOnEvent from "../../utils/helpers/email.on.event.js";
import randomString from "../../utils/helpers/random.string.js";
import { generateAndSaveOtp } from "../../utils/generateOtp.js";
import { auth, server } from "../../config/env.js";
import User from "../models/user.model.js";
import OtpVerification from "../models/otp.verification.model.js";

// social logins
const facebookLoginStrategy = (passport) => {
    passport.use(
        new FacebookStrategy(
            {
                clientID: auth.facebookClientId,
                clientSecret: auth.facebookClientIdecret,
                callbackURL: "https://dev.roamdigi.com/api/auth/facebook/callback",
                profileFields: ["id", "displayName", "photos", "email"],
            },
            async function (accessToken, refreshToken, profile, done) {
                try {
                    const email = profile?.emails?.[0]?.value || profile._json?.email;

                    if (!email) {
                        return done(new Error("Email not available from Facebook"), null);
                    }

                    const query = { $or: [{ facebookID: profile._json.id }, { email }] };
                    const existingUser = await User.findOne(query).select("-password");
                    if (existingUser) {
                        if (!existingUser?.facebookID) {
                            existingUser.facebookID = profile._json.id;
                            existingUser.save();
                        }
                        return done(null, existingUser)
                    };

                    const user = await User.create({
                        facebookID: profile._json.id,
                        name: profile._json.name,
                        email: email,
                        password: randomString(8),
                        accountType: 1,
                        userRole: 1,
                        verified: true,
                    });

                    done(null, user);
                } catch (error) {
                    return done(error, null);
                }
            }
        )
    );
};

const googleLoginStrategy = (passport) => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: auth.googleClientId,
                clientSecret: auth.googleClientIdSecret,
                callbackURL: "https://dev.roamdigi.com/api/auth/google/callback",
            },
            async (token, tokenSecret, profile, done) => {
                try {
                    const query = { $or: [{ googleID: profile.id }, { email: profile._json.email }] };
                    const existingUser = await User.findOne(query).select("-password");
                    if (existingUser) {
                        if (!existingUser?.googleID) {
                            existingUser.googleID = profile.id;
                            existingUser.save();
                        }
                        return done(null, existingUser)
                    };

                    const user = await User.create({
                        name: profile._json.name,
                        email: profile._json.email,
                        password: randomString(8),
                        accountType: 1,
                        userRole: 1,
                        googleID: profile.id,
                        verified: true,
                    });

                    done(null, user);
                } catch (error) { return done(error, null); }
            }
        )
    );
};

const appleLoginStrategy = (passport) => {
    passport.use(
        new AppleStrategy(
            {
                clientID: auth.appleClientID,
                teamID: auth.appleTeamID,
                keyID: auth.appleKeyID,
                privateKeyLocation: auth.privateKeyLocation,
                callbackURL: "https://dev.roamdigi.com/api/auth/apple/callback",
                scope: ["name", "email"],
                passReqToCallback: true,
            },
            async (accessToken, refreshToken, idToken, profile, done) => {
                try {
                    const appleID = profile?.id;
                    const email = profile?.email || `${socialID}@appleid.com`;
                    const name = profile?.name?.firstName || "Apple User";

                    const query = { $or: [{ appleID }, { email: email.toLowerCase() }] };
                    const existingUser = await User.findOne(query).select("-password");
                    if (existingUser) {
                        if (!existingUser?.appleID) {
                            existingUser.appleID = appleID;
                            existingUser.save();
                        }
                        return done(null, existingUser)
                    };

                    const newUser = await User.create({
                        appleID,
                        name,
                        email: email.toLowerCase(),
                        password: randomString(8),
                        accountType: 1,
                        userRole: 1,
                        verified: true,
                    });

                    return done(null, newUser);
                } catch (error) {
                    return done(error, null);
                }
            }
        )
    );
};

const socialCallback = async (req, res) => {
    try {
        if (!req?.user) return res.redirect(`${server.origin}/login?error=auth_failed`);

        const user = await User.findById(req.user._id).select("-password");
        if (!!user?.deletedAt) {
            throw new Error("Account not found");
        }

        const accessToken = user.generateAccessToken();
        res.redirect(
            `${server.origin}/auth/callback?accessToken=${accessToken}&user=${encodeURIComponent(
                JSON.stringify(user)
            )}`
        );
    } catch (error) {
        res.redirect(`${server.origin}/login?error=${encodeURIComponent(error.message)}`);
    }
};

const nativeSociaSigninOrSignup = async (req, res) => {
    try {
        const { provider, email, name, providerId } = req.body;

        if (!email || !provider || !providerId || !name) {
            return res.response(400, "Missing required fields");
        }

        const socialID = `${provider}ID`;
        let user = await User.findOne({ $or: [{ [socialID]: providerId }, { email }] }).select("-password");

        if (user && !!user?.deletedAt) {
            return res.response(400, "Account not found");
        }

        if (user && !user[socialID]) {
            user[socialID] = providerId;
            await user.save();
            user = await User.findById(user._id).select("-password");
        }

        if (!user) {
            user = await User.create({
                name,
                email,
                password: randomString(8),
                accountType: 1,
                userRole: 1,
                verified: true,
                [socialID]: providerId
            });
        }

        const accessToken = await user.generateAccessToken();
        return res.response(200, "Login successfully", { accessToken, user });

    } catch (error) {
        return res.response(500, "Internal server error", { error: error.message });
    }
}

const validationLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !!user.deletedAt) {
            return res.response(400, "Account not found")
        };

        const isCorrectPassword = await user.isPasswordCorrect(password);
        if (!isCorrectPassword) {
            return res.response(400, "Email or password is incorrect");
        }

        if (!user.verified) {
            const options = {
                subject: "Your OTP Code To {{OTP_PURPOSE}}",
                purpose: "Validate Your Login Attempt!",
                otp: await generateAndSaveOtp(email),
            }
            await emailOnEvent.sendOtp(email, options);
            return res.response(403, "User is not verified", { data: { email, verified: false } });
        }

        const accessToken = await user.generateAccessToken();

        // login alert email
        emailOnEvent.newLogin(user);
        return res.response(200, "Login successful", { data: { user, accessToken } });
    } catch (error) {
        return res.response(500, "Internal server error", { error: error.message });
    }
}

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            if (!!user.deletedAt) {
                return res.response(400, "Your account is deactivated. Contact support to restore access.");
            }

            return res.response(400, "Email is already in use");
        }
        await User.create({ name, email, password });

        const options = {
            subject: "Your OTP Code To {{OTP_PURPOSE}}",
            purpose: "Verify Your Email Address!",
            otp: await generateAndSaveOtp(email),
        }
        await emailOnEvent.sendOtp(email, options);
        return res.response(201, "User created successfully", { data: { email } });
    } catch (error) {
        return res.response(500, "Internal server error", { error: error.message });
    }
};

const verifyOtp = async (req, res, next) => {
    try {
        const { otp, email } = req.body;
        const findOtp = await OtpVerification.findOne({ email });

        if (!findOtp) return res.response(404, "Otp not found");
        if (findOtp?.otp !== otp) return res.response(400, "Otp is incorrect");

        if (new Date() > findOtp.expiresAt) return res.response(400, "Otp expired");

        const user = await User.findOne({ email }).select("-password");
        user.verified = true;
        await user.save();

        const accessToken = await user.generateAccessToken();
        return res.response(200, "User verified successfully", { data: { user: user, accessToken } });
    } catch (e) {
        return res.response(500, "Internal server error", { error: e.message });
    }
};

const forgotPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.response(400, "User not found");

        const options = {
            subject: "Your OTP Code To {{OTP_PURPOSE}}",
            purpose: "Gain Your Account Access Back!",
            otp: await generateAndSaveOtp(email),
        }
        await emailOnEvent.sendOtp(email, options);

        return res.response(200, "OTP sent successfully");
    } catch (error) {
        return res.response(500, "Internal server error", { error: error.message });
    }
};

const forgotPasswordOtpVerification = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpVerification = await OtpVerification.findOne({ email });

        if (!otpVerification) return res.response(404, "Otp not found");

        let expirationDate = new Date(otpVerification.expiresAt);

        if (new Date() > expirationDate) {
            return res.response(400, "Otp expired");
        }

        const user = await User.findOne({ email });
        if (!user) return res.response(404, "User not found");

        if (otpVerification.otp !== otp) return res.response(400, "Otp is incorrect");

        const { hashedPassword } = user.generateHashedPassword();

        user.password = hashedPassword.slice(10, 18);
        await user.save();

        await emailOnEvent.temporaryPassword(email, hashedPassword.slice(10, 18));
        await emailOnEvent.passwordChange(user);

        return res.response(200, "Password reset successfully");
    } catch (error) {
        return res.response(500, "Internal server error", { error: error.message });
    }
};

const verifyToken = async (req, res) => {
    try {
        if (!req?.user) return res.response(401, "Unauthorized");
        return res.response(200, "Token is valid", { data: { user: req.user } });
    } catch (error) {
        return res.response(500, "Internal server error", { error: error.message });
    }
};

const hasSocialLogins = async (req, res) => {
    return res.response(200, "Social logins are available", { hasSocialLogins: false });
};

export default {
    facebookLoginStrategy,
    googleLoginStrategy,
    appleLoginStrategy,
    socialCallback,
    nativeSociaSigninOrSignup,
    validationLogin,
    register,
    verifyOtp,
    forgotPasswordRequest,
    forgotPasswordOtpVerification,
    verifyToken,
    hasSocialLogins
};