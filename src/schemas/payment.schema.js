import Joi from "joi";

const store = Joi.object({
    // required fields
    orderNo: Joi.string().required().messages({
        "any.required": "order no is required",
    }),
    transactionId: Joi.string().required().messages({
        "any.required": "transaction ID is required",
    }),
    amount: Joi.number().required().messages({
        "any.required": "amount is required",
    }),
    packageInfoList: Joi.string().required().messages({
        "any.required": "package info list is required",
    }),

    // optional fields
    currency: Joi.string().optional(),
    payer: Joi.string().optional(),
});

export default { store };