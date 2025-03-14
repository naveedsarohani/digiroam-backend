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

const create = Joi.object({
    eventName: Joi.string()
        .valid(...eventNames)
        .required()
        .messages({
            "any.only": `event name must be one of the following ${eventNames.join(', ')}`,
            "any.required": "event name is required",
        }),

    subject: Joi.string().min(3).max(255).required().messages({
        "string.empty": "subject cannot be empty",
        "string.min": "subject must be at least 3 characters long",
        "string.max": "subject must not exceed 255 characters",
        "any.required": "subject is required",
    }),

    body: Joi.string().min(5).required().messages({
        "string.empty": "body cannot be empty",
        "string.min": "body must be at least 5 characters long",
        "any.required": "body is required",
    }),

    attachments: Joi.optional()
});

const update = Joi.object({
    eventName: Joi.string()
        .valid(...eventNames)
        .optional()
        .messages({
            "any.only": `event name must be one of the following: ${eventNames.join(', ')}`,
        }),

    subject: Joi.string().min(3).max(255).optional().messages({
        "string.empty": "subject cannot be empty",
        "string.min": "subject must be at least 3 characters long",
        "string.max": "subject must not exceed 255 characters",
    }),

    body: Joi.min(5).optional().messages({
        "string.empty": "body cannot be empty",
        "string.min": "body must be at least 5 characters long",
    }),

    attachments: Joi.optional(),
});

export default { create, update }