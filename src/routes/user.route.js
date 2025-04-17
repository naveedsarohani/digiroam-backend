import { Router } from "express";
import {
  assignRole,
  changeCurrentPassword,
  CreateUserAndSendOtp,
  forgotPasswordOtpVerification,
  forgotPasswordRequest,
  getMyProfile,
  logout,
  sendWhatsAppOtp,
  updateMyProfile,
  verifyOtp,
  verifyToken,
} from "../controllers/user.controller.js";

import auth from "../app/middlewares/auth.js";
import schema from "../app/middlewares/schema.js";

import {
  createUserAndSendOtpSchema,
  verifyOtpSchema,
  forgotPasswordRequestSchema,
  verifyForgotPassOtpVerificationSchema,
  changeCurrentPasswordSchema,
  updateProfileSchema,
} from "../validators/user.validator.js";
import authController from "../app/controllers/auth.controller.js";
import authSchema from "../schemas/auth.schema.js";
import externalEsimPlanController from "../app/controllers/external.esim.plan.controller.js";

const userRoute = Router({ mergeParams: true });

userRoute.post("/login",
  schema.validator(authSchema.loginSchema),
  authController.validationLogin
);

userRoute
  .route("/createUserAndSendOtp")
  .post(schema.validator(createUserAndSendOtpSchema), CreateUserAndSendOtp);
// userRoute.route("/login").post(schema.validator(loginSchema), login);
userRoute.route("/logout").post(auth.authenticate, logout);
userRoute.route("/getMyProfile").get(auth.authenticate, getMyProfile);
userRoute
  .route("/updateProfile")
  .put(schema.validator(updateProfileSchema), auth.authenticate, updateMyProfile);
userRoute.route("/verifyOtp").post(schema.validator(verifyOtpSchema), verifyOtp);
userRoute.route("/verify-token").post(auth.authenticate, verifyToken);

userRoute
  .route("/forgot-password")
  .post(schema.validator(forgotPasswordRequestSchema), forgotPasswordRequest);

userRoute
  .route("/verifyForgotPasswordOtpVerification")
  .post(
    schema.validator(verifyForgotPassOtpVerificationSchema),
    forgotPasswordOtpVerification
  );

userRoute
  .route("/change-password")
  .post(schema.validator(changeCurrentPasswordSchema), auth.authenticate, changeCurrentPassword);
userRoute.route("/assignRole/:userId").post(auth.authenticate, assignRole);

userRoute.route("/getDataPackagesList").post(externalEsimPlanController.index);

userRoute.route("/sendWhatsAppOtp").post(sendWhatsAppOtp);

export { userRoute };
