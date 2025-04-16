import { Router } from "express";

import auth from "../app/middlewares/auth.js";
import schema from "../app/middlewares/schema.js";
import settingController from "../app/controllers/setting.controller.js";
import settingSchema from "../schemas/setting.schema.js";

const settingRoutes = Router({ mergeParams: true });

settingRoutes.get("/",
    settingController.read
);
settingRoutes.patch("/",
    auth.authenticate,
    schema.validator(settingSchema.update),
    settingController.update
);

export default settingRoutes;