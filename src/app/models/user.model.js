import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { application } from "../../config/env.js";

const userSchema = new mongoose.Schema(
    {
        countryID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Country",
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
        },
        phoneNumber: {
            type: String,
        },
        address: {
            type: String
        },
        accountType: {
            type: Number,
            required: true,
            enum: [1, 2], // 2 for admin account
            default: 1
        },
        balance: {
            type: Number,
            default: 0.00,
        },
        userRole: {
            type: Number,
            required: true,
            enum: [1, 2],
            default: 1
        },
        facebookID: {
            type: String,
        },
        googleID: {
            type: String,
        },
        appleID: {
            type: String,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
            default: null,
        },

        // hidden fields
        password: {
            type: String,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    } return next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ _id: this._id }, application.secret, {
        expiresIn: "7d",
    });
};

userSchema.methods.generateHashedPassword = function () {
    const unHashedPassword = crypto.randomBytes(5).toString("hex");
    return { hashedPassword: bcrypt.hashSync(unHashedPassword, 10), unHashedPassword };
};

userSchema.methods.softDelete = async function () {
    this.deletedAt = new Date();
    await this.save();
};

const User = mongoose.model("User", userSchema);
export default User;
