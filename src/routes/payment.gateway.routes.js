import { Router } from "express";

import auth from "../app/middlewares/auth.js";
import paymentGatewayController from "../app/controllers/payment.gateway.controller.js";

const paymentGatewayRoutes = Router({ mergeParams: true });

paymentGatewayRoutes.post("/paypal/generateOrderId/native",
  auth.authenticate,
  paymentGatewayController.generatePaypalForNative
);

paymentGatewayRoutes.get("/paypal/native/execute-payment",
  paymentGatewayController.capturePaypalForNative
);

paymentGatewayRoutes.get("/paypal/native/cancel",
  paymentGatewayController.paypalPaymentUrlHandler
);

paymentGatewayRoutes.post("/paypal/generateOrderId",
  auth.authenticate,
  paymentGatewayController.generatePaypalOrder
);

paymentGatewayRoutes.post("/paypal/captureOrder",
  auth.authenticate,
  paymentGatewayController.capturePaypalOrder
);

paymentGatewayRoutes.post("/stripe/stripePaymentIntent",
  auth.authenticate,
  paymentGatewayController.stripePaymentIntent
);

export default paymentGatewayRoutes;
