import { Router } from "express";
import passport from "passport";
import { ORIGIN } from "../config/env.js";
import { User } from "../models/user.model.js";

const authRoute = Router();

authRoute.get(
  "/facebook",
  passport.authenticate("facebook", { scope: "email" })
);

authRoute.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  async (req, res) => {
    try {
      let user = req.user;

      if (!user) {
        return res.redirect(`${ORIGIN}/login?error=auth_failed`);
      }

      if (!ORIGIN) {
        console.error("JWT_SECRET is not defined in environment variables.");
        return res.redirect(`${ORIGIN}/login?error=server_configuration_error`);
      }

      // Generate a JWT for the authenticated user
      user = await User.findOne({ _id: req.user._id }).select("-password");
      const accessToken = user.generateAccessToken();

      res
        .cookie("accessToken", accessToken)
        .redirect(
          `${ORIGIN}/auth/callback?accessToken=${accessToken}&user=${encodeURIComponent(
            JSON.stringify(user)
          )}}`
        );
    } catch (error) {
      res.redirect(
        `${ORIGIN}/login?error=${encodeURIComponent(error.message)}`
      );
    }
  }
);

authRoute.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);



authRoute.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      let user = req.user;
      if (!user) {
        return res.redirect(`${ORIGIN}/login?error=auth_failed`);
      }

      if (!ORIGIN) {
        console.error("JWT_SECRET is not defined in environment variables.");
        return res.redirect(`${ORIGIN}/login?error=server_configuration_error`);
      }

      user = await User.findOne({ _id: req.user._id }).select("-password");
      const accessToken = user.generateAccessToken();
      res
        .cookie("accessToken", accessToken)
        .redirect(
          `${ORIGIN}/auth/callback?accessToken=${accessToken}&user=${encodeURIComponent(
            JSON.stringify(user)
          )}`
        );
    } catch (error) {
      console.error("Error during Google callback:", error);

      res.redirect(
        `${ORIGIN}/login?error=${encodeURIComponent(error.message)}`
      );
    }
  }
);




authRoute.get(
  "/apple",
  passport.authenticate("apple", {
    scope: ["name", "email"],
  })
)


authRoute.post(
  "/apple/callback",
  passport.authenticate("apple", { session: false }),
  async (req, res) => {
    try {
      if (!req.user) {
        console.error("Authentication failed: User not found.");
        return res.redirect(
          `${ORIGIN}/login?error=auth_failed`
        );
      }

      if (!ORIGIN) {
        console.error("ORIGIN is not defined in environment variables.");
        return res.redirect(
          `/login?error=server_configuration_error`
        );
      }

      // Fetch user from DB for further operations
      const user = await User.findOne({ _id: req.user._id }).select("-password");
      if (!user) {
        console.error("User not found in database.");
        return res.redirect(
          `${ORIGIN}/login?error=user_not_found`
        );
      }

      // Generate access token
      const accessToken = user.generateAccessToken();
      if (!accessToken) {
        console.error("Failed to generate access token.");
        return res.redirect(
          `${ORIGIN}/login?error=token_generation_failed`
        );
      }

      // Set cookie and redirect
      res
        .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
        .redirect(
          `${ORIGIN}/auth/callback?accessToken=${accessToken}&user=${encodeURIComponent(
            JSON.stringify(user)
          )}`
        );
    } catch (error) {
      console.error("Error during Apple callback:", error);

      res.redirect(
        `${ORIGIN}/login?error=${encodeURIComponent(
          error.message || "unknown_error"
        )}`
      );
    }
  }
);



export { authRoute };
