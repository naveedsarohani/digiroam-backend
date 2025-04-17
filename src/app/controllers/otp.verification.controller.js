import { generateAndSaveOtp } from "../../utils/generateOtp.js";
import emailTransporter from "../../utils/helpers/email.js";

const send = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = await generateAndSaveOtp(email);

        const mailOptions = {
            subject: "Your OTP Code",
            text: `Your OTP code is ${otp}. It is valid for 2 minute.`,
        };

        await emailTransporter.send(email, mailOptions);

        return res.response(200, "OTP sent successfully");
    } catch (error) {
        return res.response(500, "Internal server error", { error: error.message });
    }
};

export default { send };