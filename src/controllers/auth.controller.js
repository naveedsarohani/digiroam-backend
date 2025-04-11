import { User } from "../models/user.model.js";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as AppleStrategy } from "passport-apple"
import path from "path"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const privateKeyLocation = path.join(__dirname, "private_Apple_key/AuthKey_RDFVK4AR7N.p8")

import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  Facebook_CLIENT_ID,
  Facebook_CLIENT_ID_SECRET,
} from "../config/env.js";


function generatePlainText(length = 16) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  const characterCount = characters.length;
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characterCount);
    result += characters[randomIndex];
  }

  return result;
}

export const initializeFacebookStrategy = (passport) => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: Facebook_CLIENT_ID,
        clientSecret: Facebook_CLIENT_ID_SECRET,
        callbackURL: "https://dev.roamdigi.com/api/auth/facebook/callback",
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          const existUser = await User.findOne({
            socialID: profile._json.id,
          }).select("-password");
          if (existUser) {
            return done(null, existUser);
          }
          const newUser = await User.create({
            socialID: profile._json.id,
            name: profile._json.name,
            email: "",
            password: "",
            accountType: 1,
            userRole: 1,
            isSocialUser: true,
          });
          done(null, newUser);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
};

export const initializeGoogleStrategy = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "https://dev.roamdigi.com/api/auth/google/callback",
      },
      async (token, tokenSecret, profile, done) => {
        try {
          const existingUser = await User.findOne({
            email: profile._json.email,
          }).select("-password");

          if (existingUser) {
            existingUser.isSocialUser = true;
            await existingUser.save();
            return done(null, existingUser);
          }

          const newUser = await User.create({
            name: profile._json.name,
            email: profile._json.email,
            password: generatePlainText(),
            accountType: 1,
            userRole: 1,
            isSocialUser: true,
            socialID: profile.id,
          });

          done(null, newUser);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
};


export const initializeAppleStrategy = (passport) => {
  passport.use(
    new AppleStrategy(
      {
        clientID: "com.roamdigi.si",
        teamID: "4PAJC5AVN9",
        keyID: "RDFVK4AR7N",
        privateKeyLocation: privateKeyLocation,
        callbackURL: "https://dev.roamdigi.com/api/auth/apple/callback",
      },
      async (accessToken, refreshToken, idToken, profile, done) => {
        try {
          console.log("Access Token:", accessToken);
          console.log("Refresh Token:", refreshToken);
          console.log("ID Token:", idToken);
          console.log("User profile:", profile);

          const existUser = await User.findOne({
            socialID: profile.id,
          }).select("-password");

          if (existUser) {
            return done(null, existUser);
          }

          const newUser = await User.create({
            socialID: profile.id,
            name: profile.name,
            email: profile.email,
            password: generatePlainText(),
            accountType: 1,
            userRole: 1,
            isSocialUser: true,
          });

          done(null, newUser);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
};







