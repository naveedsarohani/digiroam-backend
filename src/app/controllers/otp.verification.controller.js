import { generateAndSaveOtp } from "../../utils/generateOtp.js";
import emailOnEvent from "../../utils/helpers/email.on.event.js";

const send = async (req, res) => {
    try {
        const { email } = req.body;

        const mailOptions = {
            subject: "Your OTP Code",
            text: `Your OTP code is ${otp}. It is valid for 2 minute.`,
        };

        const options = {
            subject: "Your OTP Code To {{OTP_PURPOSE}}",
            purpose: "Verify Your Identity",
            otp: await generateAndSaveOtp(email),
        }
        await emailOnEvent.sendOtp(email, options);
        return res.response(200, "OTP sent successfully");
    } catch (error) {
        return res.response(500, "Internal server error", { error: error.message });
    }
};

export default { send };