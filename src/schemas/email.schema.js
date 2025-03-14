import Joi from "joi";

const eventNames = [
    "ON_PURCHASE",
    "ON_CANCEL",
    "ON_ONE_DAY_LEFT",
    "ON_USED_80",
    "ON_OFF_20",
    "ON_OFF_50",
    "ON_OFF_80",
    "ON_TOP_UP",
    "ON_EXPIRED",
    "ON_PASSWORD_CHANGE",
    "ON_LOGIN",
    "ON_DISCOUNT"
]

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
});

export default { send };
