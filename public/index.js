import dotenv from "dotenv";
import compression from "compression";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import rateLimit from "express-rate-limit";

import errorHandler from "../src/app/middlewares/error.handler.js";
import response from "../src/app/middlewares/response.js";
import database from "../src/config/database.js";
import { application, server } from "../src/config/env.js";
import apiRoutes from "../src/app.js";
import {
    initializeAppleStrategy,
    initializeFacebookStrategy,
    initializeGoogleStrategy,
} from "../src/controllers/auth.controller.js";

// Load env variables
dotenv.config({ path: "../src/config/env.js" });

// Initialize Express app
const app = express();

// ----------------------
// ✅ CORS CONFIGURATION
// ----------------------
const allowedOrigins = ["https://roamdigi.com", "http://localhost:5173"];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

// ✅ Handle preflight requests for all routes
app.options("*", cors({
    origin: allowedOrigins,
    credentials: true,
}));

// ----------------------
// ✅ Security & Utility Middlewares
// ----------------------
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// ----------------------
// ✅ Passport Strategies
// ----------------------
app.use(passport.initialize());
initializeFacebookStrategy(passport);
initializeGoogleStrategy(passport);
initializeAppleStrategy(passport);

// ----------------------
// ✅ Global Middleware: Response Wrapper
// ----------------------
app.use(response);

// ----------------------
// ✅ Rate Limiting
// ----------------------
app.use(rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 80,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests, please try again later.",
}));

// ----------------------
// ✅ Debug Logging for Origins (for CORS debugging)
app.use((req, res, next) => {
    console.log("Incoming Origin:", req.headers.origin);
    next();
});

// ----------------------
// ✅ Root Route
// ----------------------
app.get("/", (_, res) => {
    res.response(200, "Backend is up and fine!", { developer: application.developer });
});

// ----------------------
// ✅ API Routes
// ----------------------
app.use("/api", apiRoutes);

// ----------------------
// ✅ Global Error Handler (with CORS headers)
// ----------------------
app.use((err, req, res, next) => {
    console.error("Global Error:", err.stack);

    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

// ----------------------
// ✅ Start Server (After DB Connection)
// ----------------------
database.connect()
    .then(() => {
        app.listen(server.port, () => {
            console.log(`✅ Server running at http://127.0.0.1:${server.port}`);
        });
    })
    .catch((error) => {
        console.error("❌ Failed to connect to DB or start server:", error);
    });
