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
    packageInfoList: Joi.array().required().messages({
        "any.required": "package info list is required",
    }),

    // optional fields
    currency: Joi.optional(),
    payer: Joi.optional(),
});

const webhook = Joi.object({
    notifyType: Joi.string().required().messages({
        "any.required": "notify type no is required",
    }),
    content: Joi.string().required().messages({
        "any.required": "content is required",
    }),
});

export default { store, webhook };