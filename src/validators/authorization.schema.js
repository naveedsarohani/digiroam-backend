import Joi from "joi";

const register = Joi.object({
    name: Joi.string().required().messages({
        "any.required": "event name is required",
    }),
    password: Joi.string().required().messages({
        "any.required": "password is required",
    }),
    email: Joi.string().email().required().messages({
        "any.email": "user email must be a valid email",
        "any.required": "user email is required",
    }),
});

export default { admin: { register } };
