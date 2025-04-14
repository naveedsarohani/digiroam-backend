import { Router } from "express";
import { validate } from "../middeware/validation.js";
import userSchema from "../schemas/user.schema.js";
import userController from "../app/controllers/user.controller.js";
import { auth } from "../middeware/a.js";

const userRoutes = Router({ mergeParams: true });

userRoutes.get("/",
    auth, userController.index
);
// userRoutes.get("/:userId",
//     auth, userController.show
// );
userRoutes.get("/esims",
    auth, userController.esims
);
// userRoutes.post("/",
//     validate(userSchema.create), userController.create
// );
// userRoutes.delete("/:userId",
//     auth, userController.delete
// );

export default userRoutes;