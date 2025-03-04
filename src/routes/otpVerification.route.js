import { Router } from "express";
import { againSendOtp } from "../controllers/otpVerification.controller.js";



 const otpVerificationRoute=Router()


 otpVerificationRoute.route("/againSendOtp").post(againSendOtp)


 

export {otpVerificationRoute}