import Joi from "joi";

const dataPackagesSchema = Joi.object({
  locationCode: Joi.string().optional().allow(""),
  type: Joi.string().optional().allow(""),
  slug: Joi.string().optional().allow(""),
  packageCode: Joi.string().optional().allow(""),
  iccid: Joi.string().optional().allow(""),
});

const orderProfileSchema = Joi.object({
  transactionId: Joi.string().max(50).required(),
  amount: Joi.string().optional(),
  packageInfoList: Joi.array()
    .items(
      Joi.object({
        packageCode: Joi.string().alphanum().required(),
        count: Joi.number().integer().required(),
        price: Joi.number().required(),
      })
    )
    .required(),
});

const allocatedProfileSchema = Joi.object({
  orderNo: Joi.string().optional(),
  iccid: Joi.string().optional(),
  startTime: Joi.string()
    .optional()
    .pattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}([+-]\d{2}:\d{2}|Z)$/)
    .message(
      "The date must be in the format YYYY-MM-DDTHH:mm+HH:mm or YYYY-MM-DDTHH:mmZ."
    ),
  endTime: Joi.string()
    .optional()
    .pattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}([+-]\d{2}:\d{2}|Z)$/)
    .message(
      "The date must be in the format YYYY-MM-DDTHH:mm+HH:mm or YYYY-MM-DDTHH:mmZ."
    ),
  pager: Joi.object({
    pageNum: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).required(),
  })
    .required()
    .messages({
      "object.base": "Page parameters are required",
    }),
});

const cancelProfileSchema = Joi.object({
  iccid: Joi.string().optional().label("ICCID"),
  esimTranNo: Joi.string().optional().label("eSIM Transaction Number"),
}).xor("iccid", "esimTranNo");

cancelProfileSchema.messages({
  "object.xor":
    "You must provide either ICCID or eSIM Transaction Number, but not both.",
});

const suspendProfileSchema = Joi.object({
  iccid: Joi.string().optional().label("ICCID"),
  esimTranNo: Joi.string().optional().label("eSIM Transaction Number"),
}).xor("iccid", "esimTranNo");

suspendProfileSchema.messages({
  "object.xor":
    "You must provide either ICCID or eSIM Transaction Number, but not both.",
});

const unsuspendProfileSchema = Joi.object({
  iccid: Joi.string().optional().label("ICCID"),
  esimTranNo: Joi.string().optional().label("eSIM Transaction Number"),
}).xor("iccid", "esimTranNo");

unsuspendProfileSchema.messages({
  "object.xor":
    "You must provide either ICCID or eSIM Transaction Number, but not both.",
});

const revokeProfileSchema = Joi.object({
  iccid: Joi.string().optional().label("ICCID"),
  esimTranNo: Joi.string().optional().label("eSIM Transaction Number"),
}).xor("iccid", "esimTranNo");

revokeProfileSchema.messages({
  "object.xor":
    "You must provide either ICCID or eSIM Transaction Number, but not both.",
});

const topUpSchema = Joi.object({
  iccid: Joi.string().optional().label("ICCID"),
  esimTranNo: Joi.string().optional().label("eSIM Transaction Number"),
  packageCode: Joi.string().required().label("Package Code"),
  amount: Joi.string().optional(),
  transactionId: Joi.string().required().label("Transaction ID is required"),
}).xor("iccid", "esimTranNo");

topUpSchema.messages({
  "object.xor":
    "You must provide either ICCID or eSIM Transaction Number, but not both.",
});

const webhookSchema = Joi.object({
  webhook: Joi.string().required(),
});
webhookSchema.messages({
  "object.required": "Webhook is required",
});

const sendSmsSchema = Joi.object({
  iccid: Joi.string().optional().label("ICCID"),
  esimTranNo: Joi.string().optional().label("eSIM Transaction Number"),
  message: Joi.string().required().label("Message is required"),
}).xor("iccid", "esimTranNo");

sendSmsSchema.messages({
  "object.xor":
    "You must provide either ICCID or eSIM Transaction Number, but not both.",
});

export {
  dataPackagesSchema,
  orderProfileSchema,
  allocatedProfileSchema,
  cancelProfileSchema,
  suspendProfileSchema,
  unsuspendProfileSchema,
  revokeProfileSchema,
  topUpSchema,
  webhookSchema,
  sendSmsSchema,
};
