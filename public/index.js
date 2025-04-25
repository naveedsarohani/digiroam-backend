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
import authController from "../src/app/controllers/auth.controller.js";

const app = express();
dotenv.config({ path: "../src/config/env.js" });
authController.facebookLoginStrategy(passport);
authController.googleLoginStrategy(passport);
authController.appleLoginStrategy(passport);

import { fileURLToPath } from 'url';
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Create a write stream (in append mode)
const logStream = fs.createWriteStream(path.join(__dirname, "logs/access.log"), { flags: "a" });

// Morgan setup to log HTTP requests to file
app.use(morgan("combined", { stream: logStream })); // Logs to file


// application-level middlewares
app.use(cors({ origin: ["http://localhost:5173", server.origin], credentials: true }));
app.use(passport.initialize());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(helmet()); // Security middleware
app.use(compression()); // Gzip compression
app.use(morgan("dev")); // Logging middleware
app.use(cookieParser()); // Cookie parsing middleware
app.use(response);
app.use(errorHandler);
app.use(rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 80, // Limit each IP to 100 requests per `window`
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: "Too many requests, Please try again later.",
}));

// root route
app.get("/", (_, res) => {
    res.response(200, "Backend is up and fine!", { developer: application.developer });
});

// api routes
app.use("/api", apiRoutes);

// app listener
database.connect().then(() => {
    app.listen(server.port, () => {
        console.log(`The server has started at [http://127.0.0.1:${server.port}]`);
    });
}).catch((error) => {
    console.error('An error occurred while starting the server: ', error);
});

// error handling middleware (generic error handler)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.response(err.status ? err.status : err.statusCode, err.message);
});