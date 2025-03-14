import { Router } from "express";
import paymentController from "../app/controllers/payment.controller.js";
import { validate } from "../middeware/validation.js";
import paymentSchema from "../schemas/payment.schema.js"
import { auth } from "../middeware/auth.js";

const paymentRoutes = Router({ mergeParams: true });

paymentRoutes.post('/store',
    auth, validate(paymentSchema.store), paymentController.store
);
paymentRoutes.get("/getMyPaymentInfo",
    auth, paymentController.payments
);
paymentRoutes.post("/webhook/notifications",
    validate(paymentSchema.webhook), paymentController.webHook
);

// testing
paymentRoutes.get("/send-email/:paymentId",
    paymentController.sendEmail
);

export default paymentRoutes;