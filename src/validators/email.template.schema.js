import Joi from "joi";

const eventNames = ["ON_PURCHASE", "ON_CANCEL"];
const allowedFileExtensions = ["pdf", "docx", "pptx", "txt"];

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

    // attachments: Joi.alternatives().try(
    //     Joi.array().items(
    //         Joi.object({
    //             name: Joi.string().required().messages({
    //                 "string.empty": "Attachment name is required",
    //             }),
    //             extension: Joi.string()
    //                 .valid(...allowedFileExtensions)
    //                 .required()
    //                 .messages({
    //                     "any.only": `Allowed file types are: ${allowedFileExtensions.join(", ")}`,
    //                     "any.required": "File extension is required",
    //                 }),
    //             size: Joi.number().max(10 * 1024 * 1024).required().messages({
    //                 "number.max": "File size must not exceed 10MB",
    //                 "any.required": "File size is required",
    //             }),
    //         })
    //     ),
    //     Joi.object({
    //         name: Joi.string().required(),
    //         extension: Joi.string().valid(...allowedFileExtensions).required(),
    //         size: Joi.number().max(10 * 1024 * 1024).required(),
    //     })
    // ).messages({
    //     "alternatives.match": "Attachments must be a valid file object or an array of file objects.",
    //     "object.unknown": "Invalid attachment format.",
    // }),
});

const update = Joi.object({
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

    // attachments: Joi.alternatives().try(
    //     Joi.array().items(
    //         Joi.object({
    //             name: Joi.string().required().messages({
    //                 "string.empty": "Attachment name is required",
    //             }),
    //             extension: Joi.string()
    //                 .valid(...allowedFileExtensions)
    //                 .required()
    //                 .messages({
    //                     "any.only": `Allowed file types are: ${allowedFileExtensions.join(", ")}`,
    //                     "any.required": "File extension is required",
    //                 }),
    //             size: Joi.number().max(10 * 1024 * 1024).required().messages({
    //                 "number.max": "File size must not exceed 10MB",
    //                 "any.required": "File size is required",
    //             }),
    //         })
    //     ),
    //     Joi.object({
    //         name: Joi.string().required(),
    //         extension: Joi.string().valid(...allowedFileExtensions).required(),
    //         size: Joi.number().max(10 * 1024 * 1024).required(),
    //     })
    // ).messages({
    //     "alternatives.match": "Attachments must be a valid file object or an array of file objects.",
    //     "object.unknown": "Invalid attachment format.",
    // }),
});

export default { create, update };
