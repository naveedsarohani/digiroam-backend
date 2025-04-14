import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import { application } from "../config/env.js";

const auth = async (req, res, next) => {
    try {
        const token = req.header?.Authorization?.replace("Bearer ", "");
        if (!token) return res.response(401, "Unauthenticated");

        const decodedToken = jwt.verify(token, application.secretKey);
        const user = await User.findById(decodedToken?._id).select("-password");

        if (!user) return res.response(401, "Token is invalid");
        req.user = user;

        next();
    } catch (error) {
        return res.response(401, error.message);
    }
};

export { auth };