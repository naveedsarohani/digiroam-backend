import { Router } from "express";
import otpVerificationController from "../app/controllers/otp.verification.controller.js";

const otpVerificationRoutes = Router({ mergeParams: true });

otpVerificationRoutes.post("/againSendOtp",
    otpVerificationController.send
);

export default otpVerificationRoutes