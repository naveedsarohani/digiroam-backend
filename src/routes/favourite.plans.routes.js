import { Router } from "express";

import auth from "../app/middlewares/auth.js";
import schema from "../app/middlewares/schema.js";
import favouritePlanController from "../app/controllers/favourite.plan.controller.js";
import favouritePlansSchema from "../schemas/favourite.plans.schema.js";

const FavouritePlanRoutes = Router({ mergeParams: true });

FavouritePlanRoutes.get("/",
    auth.authenticate,
    favouritePlanController.index
);

FavouritePlanRoutes.post("/",
    auth.authenticate,
    schema.validator(favouritePlansSchema.upsert),
    favouritePlanController.upsert
);

FavouritePlanRoutes.delete("/:packageCode",
    auth.authenticate,
    favouritePlanController.remove
);

export default FavouritePlanRoutes;