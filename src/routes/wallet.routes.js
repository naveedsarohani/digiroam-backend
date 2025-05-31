import { Router } from "express";

import auth from "../app/middlewares/auth.js";
import transactionController from "../app/controllers/transaction.controller.js";
import walletController from "../app/controllers/wallet.controller.js";

const walletRoutes = Router({ mergeParams: true });

walletRoutes.get("/balance",
    auth.authenticate,
    walletController.balance
);

walletRoutes.post("/add-funds",
    auth.authenticate,
    walletController.deposit
);

walletRoutes.post("/use-funds",
    auth.authenticate,
    walletController.useFunds
);

walletRoutes.post("/cancel-and-refund",
    auth.authenticate,
    walletController.cancelAndRefund
);

walletRoutes.post("/stripe/add-funds",
    auth.authenticate,
    walletController.stripeDeposit
);

walletRoutes.post("/paypal/generate-order/add-funds",
    auth.authenticate,
    walletController.generatePaypalOrderDeposit
);

walletRoutes.post("/paypal/capture-order/add-funds",
    auth.authenticate,
    walletController.capturePaypalOrderDeposit
);

walletRoutes.post("/stripe-native/add-funds",
    auth.authenticate,
    walletController.stripeDepositFromNative
);

walletRoutes.post("/paypal-native/generate-order/add-funds",
    auth.authenticate,
    walletController.generatePaypalOrderDepositFromNative
);

walletRoutes.get("/paypal-native/capture-order/add-funds",
    auth.authenticate,
    walletController.capturePaypalOrderDepositFromNative
);
walletRoutes.get("/paypal-native/capture-order/failed",
    auth.authenticate,
    walletController.paypalCaptureOrderFailedFromNative
);

walletRoutes.get("/transactions",
    auth.authenticate,
    transactionController.retrieveAll
);

export default walletRoutes;