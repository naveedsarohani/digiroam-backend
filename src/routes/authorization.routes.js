import { Router } from "express";
import { validate } from "../middeware/validation.js";
import authorizationSchema from "../validators/authorization.schema.js";
import authorizationController from "../controllers/authorization.controller.js";
import { auth } from "../middeware/auth.js";

const authorizationRoutes = Router({ mergeParams: true });

authorizationRoutes.get("/view-admins",
    auth, authorizationController.admin.index
);

authorizationRoutes.post("/register-admin",
    validate(authorizationSchema.admin.register), authorizationController.admin.register
);

export default authorizationRoutes;