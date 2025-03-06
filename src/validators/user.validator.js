import joi from "joi";

const createUserAndSendOtpSchema = joi.object({
  name: joi.string().min(3).required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
});

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

const verifyOtpSchema = joi.object({
  email: joi.string().email().required(),
  otp: joi.string().min(6).required(),
});

const updateProfileSchema = joi.object({
  name: joi.string().min(3).required(),
  email: joi.string().email().required(),
  phoneNumber: joi.string().min(10).max(15).required(),
  address: joi.string().required(),
  countryID: joi.string().required()
});

const sendoptSchema = joi.object({
  email: joi.string().email().required(),
});

const changeCurrentPasswordSchema = joi.object({
  oldPassword: joi.string().required().min(8),
  newPassword: joi.string().required().min(8)
})

const verifyotpSchema = joi.object({
  email: joi.string().email().required(),
  otp: joi.string().min(6).required(),
});


const forgotPasswordRequestSchema = joi.object({
  email: joi.string().email().required(),
})

const verifyForgotPassOtpVerificationSchema = joi.object({
  email: joi.string().email().required(),
  otp: joi.string().min(6).required(),
});

export {
  verifyOtpSchema,
  createUserAndSendOtpSchema,
  loginSchema,
  sendoptSchema,
  verifyotpSchema,
  forgotPasswordRequestSchema,
  verifyForgotPassOtpVerificationSchema,
  changeCurrentPasswordSchema,
  updateProfileSchema
};
