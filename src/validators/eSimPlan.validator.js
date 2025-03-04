import Joi from "joi";

const eSimPlancreateSchema = Joi.object({
  planName: Joi.string().required(),
  dataLimit: Joi.string().required(),
  voiceMinutes: Joi.number().integer().required(),
  messageLimits: Joi.number().integer().required(),
  validity: Joi.number().integer().required(),
  price: Joi.number().required(),
  description: Joi.string().optional().allow(""),
  countryId: Joi.string()
});


const updateESimPlanSchema=Joi.object({
  dataLimit: Joi.string().required(),
  voiceMinutes: Joi.number().integer().required(),
  messageLimits: Joi.number().integer().required(),
  validity: Joi.number().integer().required(),
  price: Joi.number().required(),
  description: Joi.string().optional().allow("")
})
export { eSimPlancreateSchema ,updateESimPlanSchema};
