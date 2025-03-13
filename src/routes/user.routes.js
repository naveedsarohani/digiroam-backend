import { Router } from "express";
import { validate } from "../middeware/validation.js";
import userSchema from "../schemas/user.schema.js";
import userController from "../app/controllers/user.controller.js";

const userRoutes = Router({ mergeParams: true });

userRoutes.get("/",
    userController.index
);
userRoutes.get("/:userId",
    userController.show
);
userRoutes.post("/",
    validate(userSchema.create), userController.create
);
userRoutes.delete("/:userId",
    userController.delete
);

export default userRoutes;