import { Router } from "express";
import passport from "passport";

import authController from "../app/controllers/auth.controller.js";

const authRoutes = Router({ mergeParams: true });

// social login routes
authRoutes.get("/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

authRoutes.get("/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  authController.socialCallback
);

authRoutes.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRoutes.get("/google/callback",
  passport.authenticate("google", { session: false }),
  authController.socialCallback
);

authRoutes.get("/apple",
  passport.authenticate("apple", { scope: ["name", "email"] })
)

authRoutes.post("/apple/callback",
  passport.authenticate("apple", { session: false }),
  authController.socialCallback
);

// direct login routes
// authRoutes.post("/login",
//   schema.validator(authSchema.loginSchema),
//   authController.validationLogin
// )

export default authRoutes;