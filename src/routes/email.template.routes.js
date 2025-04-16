import { Router } from "express";

import auth from "../app/middlewares/auth.js";
import schema from "../app/middlewares/schema.js";
import emailTemplateController from "../app/controllers/email.template.controller.js";
import emailTemplateSchema from "../schemas/email.template.schema.js";
import file from "../app/middlewares/file.js";

const emailTemplateRoutes = Router({ mergeParams: true });

emailTemplateRoutes.get("/",
    auth.authenticate,
    emailTemplateController.index
);

emailTemplateRoutes.get("/:emailTemplateId",
    auth.authenticate,
    emailTemplateController.show
);

emailTemplateRoutes.post("/",
    auth.authenticate,
    file.save("attachments", 5),
    schema.validator(emailTemplateSchema.create),
    emailTemplateController.create
);

emailTemplateRoutes.patch("/:emailTemplateId",
    auth.authenticate,
    file.save("attachments", 5),
    schema.validator(emailTemplateSchema.update),
    emailTemplateController.update
);

emailTemplateRoutes.delete("/:emailTemplateId",
    auth.authenticate,
    emailTemplateController.delete
);

export default emailTemplateRoutes;