import { Router } from "express";
import { auth } from "../middeware/auth.js"
import {
  payapalcaptureOrder,
  paypalGenerateOrderId,
  stripePaymentIntent,
} from "../controllers/payment.gateway.controller.js";

const paymentGatewayRoutes = Router();

paymentGatewayRoutes.route("/paypal/generateOrderId").post(auth, paypalGenerateOrderId);
paymentGatewayRoutes.route("/paypal/captureOrder").post(auth, payapalcaptureOrder);
paymentGatewayRoutes.route("/stripe/stripePaymentIntent").post(stripePaymentIntent);

export default paymentGatewayRoutes;
