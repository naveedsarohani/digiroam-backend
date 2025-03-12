import { Router } from "express";
import { validate } from "../middeware/validation.js";
import authorizationSchema from "../validators/authorization.schema.js";
import authorizationController from "../controllers/authorization.controller.js";
import { auth } from "../middeware/auth.js";

const authorizationRoutes = Router({ mergeParams: true });

authorizationRoutes.get("/view-admins",
    authorizationController.admin.index
);

authorizationRoutes.post("/register-admin",
    validate(authorizationSchema.admin.register), authorizationController.admin.register
);

authorizationRoutes.delete("/delete-admin/:id",
    validate(authorizationSchema.admin.register), authorizationController.admin.delete
);

export default authorizationRoutes;