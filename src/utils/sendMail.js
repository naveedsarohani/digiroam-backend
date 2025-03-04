import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";
import { SENDER_EMAIL, SENDER_EMAIL_PASS } from "../config/env.js";
configDotenv();

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: SENDER_EMAIL,
    pass: SENDER_EMAIL_PASS,
  },
});

export { transporter };
