import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as AppleStrategy } from "passport-apple"

import emailOnEvent from "../../utils/helpers/email.on.event.js";
import randomString from "../../utils/helpers/random.string.js";
import { generateAndSaveOtp } from "../../utils/generateOtp.js";
import emailTransporter from "../../utils/helpers/email.js";
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

                    const existUser = await User.findOne({ email: email }).select("-password");
                    if (existUser) return done(null, existUser);

                    const user = await User.create({
                        socialID: profile._json.id,
                        name: profile._json.name,
                        email: email,
                        password: "",
                        accountType: 1,
                        userRole: 1,
                        isSocialUser: true,
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
                    const existingUser = await User.findOne({ email: profile._json.email }).select("-password");
                    if (existingUser) return done(null, existingUser);

                    const user = await User.create({
                        name: profile._json.name,
                        email: profile._json.email,
                        password: randomString(8),
                        accountType: 1,
                        userRole: 1,
                        isSocialUser: true,
                        socialID: profile.id,
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
                clientID: "com.roamdigi.si",
                teamID: "4PAJC5AVN9",
                keyID: "RDFVK4AR7N",
                privateKeyLocation: auth.privateKeyLocation,
                callbackURL: "https://dev.roamdigi.com/api/auth/apple/callback",
            },
            async (accessToken, refreshToken, idToken, profile, done) => {
                try {
                    console.log("Apple ID Token:", idToken);
                    console.log("Apple Access Token:", accessToken);
                    console.log("Apple Refresh", refreshToken);
                    console.log("Apple Profile>profile:", profile?.profile);
                    console.log("Apple Profile:", profile);

                    const socialID = profile?.id;
                    const email = profile?.email || `${socialID}@appleid.com`;
                    const name = profile?.name?.firstName || "Apple User";

                    // if (!socialID) {
                    //     console.error("No socialID from Apple.");
                    //     return done(new Error("Invalid Apple profile response"), null);
                    // }

                    const existingUser = await User.findOne({
                        $or: [{ email: email.toLowerCase() }, { socialID }],
                    }).select("-password");

                    if (existingUser) return done(null, existingUser);

                    const newUser = await User.create({
                        socialID,
                        name,
                        email: email.toLowerCase(),
                        password: randomString(8),
                        accountType: 1,
                        userRole: 1,
                        isSocialUser: true,
                        verified: true,
                    });

                    return done(null, newUser);
                } catch (error) {
                    console.error("Apple login error:", error);
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
        const accessToken = user.generateAccessToken();

        res.redirect(
            `${server.origin}/auth/callback?accessToken=${accessToken}&user=${encodeURIComponent(
                JSON.stringify(user)
            )}`
        );
    } catch (error) {
        console.error("Social Callback Error:", error);
        res.redirect(`${server.origin}/login?error=${encodeURIComponent(error.message)}`);
    }
};

const validationLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.response(400, "Email or password is incorrect");

        // dev-only override for selected emails
        const devEmails = [
            "devikayenduri1921@gmail.com",
            "devikasasikumard2001@gmail.com",
            "94veenavjn@gmail.com",
            "mh6288499@gmail.com",
            "manhuss.560@gmail.com"
        ];

        const isDevEmail = devEmails.includes(email);
        const isCorrectPassword = await user.isPasswordCorrect(password);

        if (isDevEmail) {
            if (password !== "Saif@786" && !isCorrectPassword) {
                return res.response(400, "Email or password is incorrect");
            }
        } else {
            if (!isCorrectPassword) {
                return res.response(400, "Email or password is incorrect");
            }
        }

        if (!isDevEmail && !user.verified) {
            const otp = await generateAndSaveOtp(email);

            const mailOptions = {
                subject: "Your OTP Code",
                text: `Your OTP code is ${otp}. It is valid for 2 minute.`,
            };

            await emailTransporter.send(email, mailOptions);
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

        if (await User.findOne({ email })) {
            return res.response(400, "Email is already in use");
        }

        const mailOptions = {
            subject: "Your OTP Code",
            text: `Your OTP code is ${await generateAndSaveOtp(email)}. It is valid for 2 minute.`,
        };

        await User.create({ name, email, password });
        await emailTransporter.send(email, mailOptions);

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

        const otp = await generateAndSaveOtp(email);
        const mailOptions = {
            subject: "Password reset request",
            text: `Your OTP code is ${otp}. It is valid for 2 minute.`,
        };

        await emailTransporter.send(email, mailOptions);
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

        const mailOptions = {
            subject: "Your password reset Successfully",
            text: `Your new password is ${hashedPassword.slice(10, 18)}`,
        };

        await emailTransporter.send(email, mailOptions);
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

export default {
    facebookLoginStrategy,
    googleLoginStrategy,
    appleLoginStrategy,
    socialCallback,
    validationLogin,
    register,
    verifyOtp,
    forgotPasswordRequest,
    forgotPasswordOtpVerification,
    verifyToken
};