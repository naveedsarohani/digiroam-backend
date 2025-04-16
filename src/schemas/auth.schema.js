import Joi from "joi";

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "any.email": "Email must be a valid email address",
        "any.required": "Email is required",
    }),
    password: Joi.string().required().messages({
        "any.required": "Password is required",
    }),
});

export default { loginSchema };