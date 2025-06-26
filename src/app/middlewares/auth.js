import jwt from "jsonwebtoken";

import { application } from "../../config/env.js";
import User from "../models/user.model.js";

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers?.authorization?.replace("Bearer ", "");
        if (!token) return res.response(401, "Unauthenticated");

        const { _id } = jwt.verify(token, application.secret);
        if (!_id) return res.response(401, "Unauthenticated");

        const user = await User.findById(_id).select("-password");
        if (!user) return res.response(401, "Token is invalid");

        if (!!user?.deletedAt) return res.response(404, "Account not found");

        req.user = user;
        next();
    } catch (error) {
        return res.response(401, error?.message ?? "Token is invalid");
    }
}

const authorize = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role) || roles.includes("*")) {
        return res.response(403, "Forbidden");
    }
    next();
};

export default { authenticate, authorize };