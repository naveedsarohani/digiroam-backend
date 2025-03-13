import { Router } from "express";
import { auth } from "../middeware/auth.js";
import { validate } from "../middeware/validation.js";

import emailSchema from "../schemas/email.schema.js";
import emailController from "../app/controllers/email.controller.js";

const emailRoutes = Router({ mergeParams: true });

emailRoutes.post("/send",
    auth, validate(emailSchema.send), emailController.send
);

export default emailRoutes;