import { configDotenv } from "dotenv";

configDotenv();

const DB_URL = process.env.DB_URL;
const ORIGIN = process.env.ORIGIN;
const PORT = process.env.PORT;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const ACCESS_CODE = process.env.ACCESS_CODE;

const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
const Facebook_CLIENT_ID = process.env.Facebook_CLIENT_ID;
const Facebook_CLIENT_ID_SECRET = process.env.Facebook_CLIENT_ID_SECRET;

const OTP_SECRET = process.env.OTP_SECRET;
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const SENDER_EMAIL_PASS = process.env.SENDER_EMAIL_PASS;

const ESIM_BASE_URL = process.env.ESIM_BASE_URL;

const GET_DATA_PACKAGES_URL = process.env.GET_DATA_PACKAGES_URL;
const GET_BALANCE_QUERY_URL = process.env.GET_BALANCE_QUERY_URL;
const GET_ORDER_PROFILE_URL = process.env.GET_ORDER_PROFILE_URL;
const GET_ALLOCATED_PROFILE_URL = process.env.GET_ALLOCATED_PROFILE_URL;
const CANCEL_PROFILE_URL = process.env.CANCEL_PROFILE_URL;
const SUSPEND_PROFILE_URL = process.env.SUSPEND_PROFILE_URL;
const UN_SUSPEND_PROFILE_URL = process.env.UN_SUSPEND_PROFILE_URL;
const REVOKE_PROFILE_URL = process.env.REVOKE_PROFILE_URL;
const TOP_UP_URL = process.env.TOP_UP_URL;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const SEND_SMS_URL = process.env.SEND_SMS_URL;

const PAYPAL_MODE = process.env.PAYPAL_MODE;
const PAYPAL_CLIENT_KEY = process.env.PAYPAL_CLIENT_KEY;
const PAYPAL_SECRET_KEY = process.env.PAYPAL_SECRET_KEY;
const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE;

const STRIPE_PUBLIC_KEY = process.env.STRIPE_PUBLIC_KEY;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

const TWILIO_ID = process.env.TWILIO_ID;
const TWILIO_TOKEN = process.env.TWILIO_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;

export {
  DB_URL,
  ORIGIN,
  PORT,
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  Facebook_CLIENT_ID,
  Facebook_CLIENT_ID_SECRET,
  OTP_SECRET,
  SENDER_EMAIL,
  SENDER_EMAIL_PASS,
  ESIM_BASE_URL,
  GET_DATA_PACKAGES_URL,
  GET_BALANCE_QUERY_URL,
  GET_ORDER_PROFILE_URL,
  GET_ALLOCATED_PROFILE_URL,
  CANCEL_PROFILE_URL,
  SUSPEND_PROFILE_URL,
  UN_SUSPEND_PROFILE_URL,
  REVOKE_PROFILE_URL,
  TOP_UP_URL,
  WEBHOOK_URL,
  SEND_SMS_URL,
  PAYPAL_MODE,
  PAYPAL_CLIENT_KEY,
  PAYPAL_SECRET_KEY,
  PAYPAL_API_BASE,
  STRIPE_PUBLIC_KEY,
  STRIPE_SECRET_KEY,
  TWILIO_ID,
  TWILIO_TOKEN,
  TWILIO_WHATSAPP_NUMBER,
  ACCESS_CODE,
};

// managed by Naveed Sarohani (naveed.sarohani@gmail.com)
export const server = {
  origin: process.env.SERVER_ORIGIN,
  port: process.env.SERVER_PORT
}

export const application = {
  supportEmail: process.env.APP_SUPPORT_EMAIL,
  secret: process.env.APP_SECRET,
  developer: {
    name: "Naveed Sarohani",
    email: "naveed.sarohani@gmail.com",
    role: "Back End Developer @ Icreativez (Jamshoro-chapter)",
    linkedIn: "https://linkedin.com/in/naveedsarohani"
  }
}

export const database = {
  uri: process.env.DB_URI,
  port: process.env.DB_PORT,
  name: process.env.DB_NAME,
}

export const mail = {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  user: process.env.MAIL_USER,
  pass: process.env.MAIL_PASS,
}

export const esim = {
  baseUrl: process.env.ESIM_BASE_URL,
  accessCode: process.env.ESIM_ACCESS_CODE,
}