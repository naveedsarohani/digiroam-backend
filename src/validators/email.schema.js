import Joi from "joi";

const eventNames = ["ON_PURCHASE", "ON_CANCEL"];

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
