import { generateAndSaveOtp } from "../utils/generateOtp.js";
import { transporter } from "../utils/sendMail.js";
import { SENDER_EMAIL } from "../config/env.js";

const againSendOtp = async (req, res, next) => {
  const { email } = req.body;

  try {
    const otp = await generateAndSaveOtp(email);

    const mailOptions = {
      from: `"Icreativez" <${SENDER_EMAIL}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 2 minute.`,
    };

    const sendMail = transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    return next(err);
  }
};

export { againSendOtp };
