import { Router } from "express";
import { auth } from "../middeware/auth.js";
import emailTemplateController from "../controllers/email.template.controller.js";
import { validate } from "../middeware/validation.js";
import emailTemplateSchema from "../validators/email.template.schema.js";
import file from "../middeware/file.js";

const emailTemplateRoutes = Router({ mergeParams: true });

emailTemplateRoutes.get("/",
    auth, emailTemplateController.index
);
emailTemplateRoutes.get("/:emailTemplateId",
    auth, emailTemplateController.show
);
emailTemplateRoutes.post("/",
    auth, file.save("attachments", 5), validate(emailTemplateSchema.create), emailTemplateController.create
);
emailTemplateRoutes.patch("/:emailTemplateId",
    auth, file.save("attachments", 5), validate(emailTemplateSchema.update), emailTemplateController.update
);
emailTemplateRoutes.delete("/:emailTemplateId",
    auth, emailTemplateController.delete
);

export default emailTemplateRoutes;