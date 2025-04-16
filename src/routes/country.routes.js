import { Router } from "express";

import schema from "../app/middlewares/schema.js";
import countrySchema from "../schemas/country.schema.js";
import countryController from "../app/controllers/country.controller.js";

const countryRoutes = Router({ mergeParams: true });

countryRoutes.get("/",
    countryController.index
);

countryRoutes.post("/",
    schema.validator(countrySchema.create),
    countryController.create
)

export default countryRoutes;