import { Router } from "express";
import { againSendOtp } from "../controllers/otpVerification.controller.js";

const otpVerificationRoute = Router({ mergeParams: true });
otpVerificationRoute.route("/againSendOtp").post(againSendOtp)

export { otpVerificationRoute }