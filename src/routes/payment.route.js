import { Router } from "express";
import {auth} from "../middeware/auth.js"
import {
  payapalcaptureOrder,
  paypalGenerateOrderId,
  stripePaymentIntent,
} from "../controllers/payment.controller.js";

const payment = Router();

payment.route("/paypal/generateOrderId").post(auth,paypalGenerateOrderId);
payment.route("/paypal/captureOrder").post(auth,payapalcaptureOrder);
payment.route("/stripe/stripePaymentIntent").post(stripePaymentIntent);

export { payment };
 