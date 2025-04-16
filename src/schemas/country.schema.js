import Joi from "joi";

const create = Joi.object({
    countryName: Joi.string().required().messages({
        "any.required": "Country name is required",
    }),
    dialingCode: Joi.string().required().messages({
        "any.required": "Dialing code is required",
    }),
    currency: Joi.string().required().messages({
        "any.required": "Currency is required",
    }),
});

export default { create };