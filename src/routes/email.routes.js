import { Router } from "express";

import emailSchema from "../schemas/email.schema.js";
import emailController from "../app/controllers/email.controller.js";
import auth from "../app/middlewares/auth.js";
import schema from "../app/middlewares/schema.js";

const emailRoutes = Router({ mergeParams: true });

emailRoutes.post("/send",
    auth.authenticate,
    schema.validator(emailSchema.send),
    emailController.send
);

export default emailRoutes;