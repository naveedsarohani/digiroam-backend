import { Router } from "express";

import auth from "../app/middlewares/auth.js";
import schema from "../app/middlewares/schema.js";
import userSchema from "../schemas/user.schema.js";
import userController from "../app/controllers/user.controller.js";

const userRoutes = Router({ mergeParams: true });

userRoutes.get("/",
    auth.authenticate,
    userController.index
);

// userRoutes.get("/:userId",
//     auth, userController.show
// );

userRoutes.get("/esims",
    auth.authenticate,
    userController.esims
);

// userRoutes.post("/",
//     schema.validator(userSchema.create), 
//     userController.creates
// );

// userRoutes.delete("/:userId",
//     auth.authenticate, 
//     userController.delete
// );

export default userRoutes;