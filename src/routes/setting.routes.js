import { Router } from "express";
import { auth } from "../middeware/a.js";
import { validate } from "../middeware/validation.js";
import settingController from "../app/controllers/setting.controller.js";
import settingSchema from "../schemas/setting.schema.js";

const settingRoutes = Router({ mergeParams: true });

settingRoutes.get("/",
    settingController.read
);
settingRoutes.patch("/",
    auth, validate(settingSchema.update), settingController.update
);

export default settingRoutes;