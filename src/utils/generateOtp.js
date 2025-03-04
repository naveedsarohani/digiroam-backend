import speakeasy from "speakeasy";
import { OtpVerification } from "../models/otpVerification.model.js";
import { OTP_SECRET } from "../config/env.js";

const generateAndSaveOtp = async (email) => {
  const otp = speakeasy.totp({
    secret: OTP_SECRET,
    encoding: "base32",
  });

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 2);


  const exitsOtp = await OtpVerification.findOne({ email });

  if (!exitsOtp) {
    const createOtp = await OtpVerification.create({
      email,
      otp,
      expiresAt,
    })

    return otp
  }



  exitsOtp.expiresAt = expiresAt
  exitsOtp.otp = otp
  await exitsOtp.save()

  return otp;
};

export { generateAndSaveOtp };
