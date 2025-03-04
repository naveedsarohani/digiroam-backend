import { Router } from "express";
import { create, getCountries } from "../controllers/country.controller.js";
import { validate } from "../middeware/validation.js";
import { createCompanySchema } from "../validators/country.validator.js";


 const countryRoute=Router()


 countryRoute.route("/create").post(validate(createCompanySchema),create)
 countryRoute.route("/getAllCountries").get(getCountries)

 

export {countryRoute}