import { Router } from "express";
import auth from "../app/middlewares/auth.js";
import {
  payapalcaptureOrder,
  paypalGenerateOrderId,
  stripePaymentIntent,
} from "../controllers/payment.gateway.controller.js";

const paymentGatewayRoutes = Router({ mergeParams: true });

paymentGatewayRoutes.route("/paypal/generateOrderId").post(auth.authenticate, paypalGenerateOrderId);
paymentGatewayRoutes.route("/paypal/captureOrder").post(auth.authenticate, payapalcaptureOrder);
paymentGatewayRoutes.route("/stripe/stripePaymentIntent").post(stripePaymentIntent);

export default paymentGatewayRoutes;
