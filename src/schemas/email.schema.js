import Joi from "joi";

const eventNames = ["ON_SEND_OTP", "ON_LOGIN", "ON_PASSWORD_CHANGE", "ON_PURCHASE", "ON_CANCEL", "ON_USAGE_80", "ON_1D_VALIDITY", "ON_EXPIRED", "ON_DISCOUNT", "ON_ACTIVATION_REMINDER"]

const send = Joi.object({
    eventName: Joi.string()
        .valid(...eventNames)
        .required()
        .messages({
            "any.only": `event name must be one of the following ${eventNames.join(', ')}`,
            "any.required": "event name is required",
        }),

    userEmail: Joi.string().email().required().messages({
        "any.email": "user email must be a valid email",
        "any.required": "user email is required",
    }),

    orderNo: Joi.optional(),
    iccid: Joi.optional(),
});

export default { send };
