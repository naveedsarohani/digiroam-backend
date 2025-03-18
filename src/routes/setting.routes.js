import { Router } from "express";
import { auth } from "../middeware/auth.js";
import { validate } from "../middeware/validation.js";
import settingController from "../app/controllers/setting.controller.js";

const settingRoutes = Router({ mergeParams: true });

settingRoutes.get("/",
    settingController.read
);
settingRoutes.patch("/",
    settingController.update
);

export default settingRoutes;