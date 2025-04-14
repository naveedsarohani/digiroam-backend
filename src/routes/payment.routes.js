import { Router } from "express";
import paymentController from "../app/controllers/payment.controller.js";
import { validate } from "../middeware/validation.js";
import paymentSchema from "../schemas/payment.schema.js"
import { auth } from "../middeware/a.js";

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

export default paymentRoutes;