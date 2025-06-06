import { ApiResponse } from "../utils/ApiResonse.js";
import { configDotenv } from "dotenv";
import { TWILIO_ID, TWILIO_TOKEN, TWILIO_WHATSAPP_NUMBER } from "../config/env.js";
import Twilio from "twilio";

configDotenv();

const twilio_client = Twilio(TWILIO_ID, TWILIO_TOKEN);

const otps = {};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

const sendWhatsAppOtp = async (req, res, next) => {
  const { phone } = req.body;
  const otp = generateOTP();
  otps[phone] = otp;

  try {
    await twilio_client.messages.create({
      from: TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${phone}`,
      body: `Your verification code is: ${otp}`,
    });

    res.status(200).json({ message: "OTP sent via WhatsApp." });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP.", error });
  }
};

const logout = async (req, res, next) => {
  const options = {
    path: "/",
    httpOnly: true,
    sameSite: "None",
    secure: true,
  };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "logged out"));
};


export {
  logout,
  sendWhatsAppOtp
};
