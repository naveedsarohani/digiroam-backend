import { Router } from "express";
import { logout, sendWhatsAppOtp } from "../controllers/user.controller.js";

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
import userController from "../app/controllers/user.controller.js";

const userRoute = Router({ mergeParams: true });

userRoute.post("/login",
  schema.validator(authSchema.loginSchema),
  authController.validationLogin
);

userRoute.post("/createUserAndSendOtp",
  schema.validator(createUserAndSendOtpSchema),
  authController.register
);

userRoute.get("/getMyProfile",
  auth.authenticate,
  userController.myProfile
);

userRoute.put("/updateProfile",
  auth.authenticate,
  schema.validator(updateProfileSchema),
  userController.update
);

userRoute.post("/verifyOtp",
  schema.validator(verifyOtpSchema),
  authController.verifyOtp
);

userRoute.post("/verify-token",
  auth.authenticate,
  authController.verifyToken
);

userRoute.post("/change-password",
  auth.authenticate,
  schema.validator(changeCurrentPasswordSchema),
  userController.updatePassword
);

userRoute.post("/assignRole/:userId",
  auth.authenticate,
  userController.assignRole
);

userRoute.post("/forgot-password",
  schema.validator(forgotPasswordRequestSchema),
  authController.forgotPasswordRequest
);

userRoute.post("/verifyForgotPasswordOtpVerification",
  schema.validator(verifyForgotPassOtpVerificationSchema),
  authController.forgotPasswordOtpVerification
);

userRoute.route("/getDataPackagesList").post(externalEsimPlanController.index);

userRoute.route("/logout").post(auth.authenticate, logout);
userRoute.route("/sendWhatsAppOtp").post(sendWhatsAppOtp);

userRoute.post("/delete-account",
  auth.authenticate,
  userController.delete
);

export { userRoute };
