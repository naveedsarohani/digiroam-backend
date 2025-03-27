import Joi from "joi";

const update = Joi.object({
    pricePercentage: Joi.number().messages({
        "number.base": "Price percentage must be a number",
    }).optional(),

    service: Joi.object({
        label: Joi.string().required().messages({
            "any.required": "Service link label is required",
            "string.base": "Service link label must be a string",
        }),
        href: Joi.string().required().messages({
            "any.required": "Service link URL is required",
            "string.uri": "Service link must be a valid URL",
        }),
        isHidden: Joi.boolean().optional().messages({
            "boolean.base": "isHidden must be a boolean value",
        }),
    }).optional(),

    contact: Joi.object({
        field: Joi.string().required().messages({
            "any.required": "Contact field is required",
            "string.base": "Contact field must be a string",
        }),
        label: Joi.string().required().messages({
            "any.required": "Contact field label is required",
            "string.base": "Contact field label must be a string",
        }),
        value: Joi.string().required().messages({
            "any.required": "Contact value is required",
            "string.base": "Contact value must be a string",
        }),
        isHidden: Joi.boolean().optional().messages({
            "boolean.base": "isHidden must be a boolean value",
        }),
    }).optional(),
});

export default { update };
