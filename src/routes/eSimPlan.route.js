import { Router } from "express";
import {
  createESimPlan,
  getAllESimPlan,
  updateESimPlanById,
} from "../controllers/eSimPlan.controller.js";
import { validate } from "../middeware/validation.js";
import {
  eSimPlancreateSchema,
  updateESimPlanSchema,
} from "../validators/eSimPlan.validator.js";
import { auth } from "../middeware/auth.js";

const eSimPlanRoute = Router();

eSimPlanRoute
  .route("/create")
  .post(auth, validate(eSimPlancreateSchema), createESimPlan);

eSimPlanRoute.route("/getALlESimPlan").get(auth, getAllESimPlan);

eSimPlanRoute
  .route("/getESimPlanByCountryId/:countryId")
  .get(auth, getAllESimPlan);

eSimPlanRoute
  .route("/updateESimPlan/:id")
  .patch(validate(updateESimPlanSchema), auth, updateESimPlanById);

export { eSimPlanRoute };
