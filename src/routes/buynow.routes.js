import { Router } from "express";

import auth from "../app/middlewares/auth.js";
import buynowController from "../app/controllers/buynow.controller.js";

const buynowRoutes = Router({ mergeParams: true });

buynowRoutes.post("/",
    auth.authenticate,
    buynowController.upsert
);

buynowRoutes.get("/clear",
    auth.authenticate,
    buynowController.clear
);

export default { buynowRoutes };