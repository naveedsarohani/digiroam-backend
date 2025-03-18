import Joi from "joi";

const update = Joi.object({
    pricePercentage: Joi.string().required().messages({
        "any.required": "price percentage is required",
    }),
});

export default { update };
