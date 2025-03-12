import dotenv from "dotenv";
import compression from "compression";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";


import rateLimit from "express-rate-limit";

// Routes imports
import { router } from "./routes/index.js";
import response from "./middeware/response.js";

// Controllers imports
import {
  initializeAppleStrategy,
  initializeFacebookStrategy,
  initializeGoogleStrategy,
} from "./controllers/auth.controller.js";

// Utils
import { ApiResponse } from "./utils/ApiResonse.js";

// Config
import { ORIGIN } from "./config/env.js";

const app = express();

// Initialize environment variables as early as possible
dotenv.config({ path: "./.env" });

// Initialize passport strategies
initializeFacebookStrategy(passport);
initializeGoogleStrategy(passport);
initializeAppleStrategy(passport)

// Middleware
app.use(passport.initialize());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(helmet()); // Security middleware
app.use(compression()); // Gzip compression
app.use(morgan("dev")); // Logging middleware
app.use(cookieParser()); // Cookie parsing middleware
app.use(response); // middleware to handle api response

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173", ORIGIN],
    credentials: true,
  })
);


// Configure rate limiter
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 80, // Limit each IP to 100 requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests, Please try again later.",
});

// Apply the rate limiter to all requests
app.use(limiter);

// Root Route
app.get("/", (req, res) => {
  res.status(200).json(new ApiResponse(200, {}, "Backend is working properly"));
});

// Route middleware
app.use("/api", router);

// Error Handling middleware (generic error handler)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status ? err.status : err.statusCode)
    .json(
      new ApiResponse(err.code ? err.code : err.statusCode, {}, err.message)
    );
});

export { app };
