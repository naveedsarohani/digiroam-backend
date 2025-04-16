import { Router } from "express";

import auth from "../app/middlewares/auth.js";
import schema from "../app/middlewares/schema.js";
import paymentController from "../app/controllers/payment.controller.js";
import paymentSchema from "../schemas/payment.schema.js"

const paymentRoutes = Router({ mergeParams: true });

paymentRoutes.post('/store',
    auth.authenticate,
    schema.validator(paymentSchema.store),
    paymentController.store
);

paymentRoutes.get("/getMyPaymentInfo",
    auth.authenticate,
    paymentController.payments
);

paymentRoutes.post("/webhook/notifications",
    schema.validator(paymentSchema.webhook),
    paymentController.webHook
);

export default paymentRoutes;