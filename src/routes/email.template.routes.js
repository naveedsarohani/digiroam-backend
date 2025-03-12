import { Router } from "express";
import { auth } from "../middeware/auth.js";
import emailTemplateController from "../controllers/email.template.controller.js";
import { validate } from "../middeware/validation.js";
import emailTemplateSchema from "../validators/email.template.schema.js";
import file from "../middeware/file.js";

const emailTemplateRoutes = Router({ mergeParams: true });

emailTemplateRoutes.get("/",
    emailTemplateController.index
);
emailTemplateRoutes.get("/:emailTemplateId",
    emailTemplateController.show
);
emailTemplateRoutes.post("/",
    file.save("attachments", 5), validate(emailTemplateSchema.create), emailTemplateController.create
);
emailTemplateRoutes.patch("/:emailTemplateId",
    file.save("attachments", 5), validate(emailTemplateSchema.update), emailTemplateController.update
);
emailTemplateRoutes.delete("/:emailTemplateId",
    emailTemplateController.delete
);

export default emailTemplateRoutes;