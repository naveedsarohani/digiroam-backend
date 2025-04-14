import { Router } from "express";
import { auth } from "../middeware/a.js";
import { validate } from "../middeware/validation.js";
import favouritePlanController from "../app/controllers/favourite.plan.controller.js";
import favouritePlansSchema from "../schemas/favourite.plans.schema.js";

const FavouritePlanRoutes = Router({ mergeParams: true });

FavouritePlanRoutes.get("/",
    auth, favouritePlanController.index
);

FavouritePlanRoutes.post("/",
    auth, validate(favouritePlansSchema.upsert), favouritePlanController.upsert
);

FavouritePlanRoutes.delete("/:packageCode",
    auth, favouritePlanController.remove
);

export default FavouritePlanRoutes;