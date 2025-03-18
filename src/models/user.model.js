import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET } from "../config/env.js";

import crypto from "crypto";
import DeviceFingerprint from "../app/models/device.fingerprint.model.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    address: {
      type: String
    },
    countryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
    },
    accountType: {
      type: Number,
      required: true,
      default: 1
    },
    balance: {
      type: Number,
      default: 0.0,
    },
    userRole: {
      type: Number,
      required: true,
    },
    isSocialUser: {
      type: Boolean,
      default: false,
    },
    socialID: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateHashedPassword = function () {
  const unHashedPassword = crypto.randomBytes(5).toString("hex");


  const hashedPassword = crypto
    .createHash("sha256")
    .update(unHashedPassword)
    .digest("hex");
  return { hashedPassword };
};




export const User = mongoose.model("User", userSchema);
