import Joi from "joi";

const createCompanySchema = Joi.object({
  countryName: Joi.string().required(),
  dialingCode: Joi.string().required(),
  currency: Joi.string().required(),
});

export {createCompanySchema}