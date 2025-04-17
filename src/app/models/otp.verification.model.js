import mongoose from "mongoose";

const otpVerificationSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: false,
            trim: true,
        },
        otp: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        }
    },
);

const OtpVerification = mongoose.model("OtpVerification", otpVerificationSchema);
export default OtpVerification;