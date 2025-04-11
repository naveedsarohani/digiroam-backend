import Joi from "joi";

const upsert = Joi.object({
    packageCode: Joi.string().required().messages({
        "any.required": "Package code is required",
        "string.base": "Package code must be a string",
    }),
    slug: Joi.string().required().messages({
        "any.required": "Slug is required",
        "string.base": "Slug must be a string",
    }),
});

export default { upsert };
