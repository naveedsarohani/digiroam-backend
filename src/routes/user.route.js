import { Router } from "express";
import {
  assignRole,
  changeCurrentPassword,
  CreateUserAndSendOtp,
  forgotPasswordOtpVerification,
  forgotPasswordRequest,
  getMyProfile,
  login,
  logout,
  sendWhatsAppOtp,
  updateMyProfile,
  verifyOtp,
  verifyToken,
} from "../controllers/user.controller.js";
import { auth } from "../middeware/auth.js";
import { validate } from "../middeware/validation.js";
import {
  loginSchema,
  createUserAndSendOtpSchema,
  verifyOtpSchema,
  forgotPasswordRequestSchema,
  verifyForgotPassOtpVerificationSchema,
  changeCurrentPasswordSchema,
  updateProfileSchema,
} from "../validators/user.validator.js";
import { getDataPackagesList } from "../controllers/userExternal.controller.js";

const userRoute = Router();

userRoute
  .route("/createUserAndSendOtp")
  .post(validate(createUserAndSendOtpSchema), CreateUserAndSendOtp);
userRoute.route("/login").post(validate(loginSchema), login);
userRoute.route("/logout").post(auth, logout);
userRoute.route("/getMyProfile").get(auth, getMyProfile);
userRoute
  .route("/updateProfile")
  .put(validate(updateProfileSchema), auth, updateMyProfile);
userRoute.route("/verifyOtp").post(validate(verifyOtpSchema), verifyOtp);
userRoute.route("/verify-token").post(auth, verifyToken);

userRoute
  .route("/forgot-password")
  .post(validate(forgotPasswordRequestSchema), forgotPasswordRequest);

userRoute
  .route("/verifyForgotPasswordOtpVerification")
  .post(
    validate(verifyForgotPassOtpVerificationSchema),
    forgotPasswordOtpVerification
  );

userRoute
  .route("/change-password")
  .post(validate(changeCurrentPasswordSchema), auth, changeCurrentPassword);
userRoute.route("/assignRole/:userId").post(auth, assignRole);

userRoute.route("/getDataPackagesList").post(getDataPackagesList);


userRoute.route("/sendWhatsAppOtp").post(sendWhatsAppOtp);
export { userRoute };
