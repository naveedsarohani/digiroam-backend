import { Router } from "express";

import esimPlanController from "../app/controllers/esim.plan.controller.js";
import auth from "../app/middlewares/auth.js";
import schema from "../app/middlewares/schema.js";
import esimPlanSchema from "../schemas/esim.plan.schema.js";

const esimPlanRoutes = Router({ mergeParams: true });

esimPlanRoutes.get("/",
  auth.authenticate,
  esimPlanController.index
);

esimPlanRoutes.get(":countryId",
  auth.authenticate,
  esimPlanController.countryESimPlans
);

esimPlanRoutes.post("/",
  auth.authenticate,
  schema.validator(esimPlanSchema.create),
  esimPlanController.create
);

esimPlanRoutes.patch("/:id",
  auth.authenticate,
  schema.validator(esimPlanSchema.update),
  esimPlanController.update
);

export default esimPlanRoutes;
