import { Router } from "express";

import { userRoute } from "./user.route.js";
import { countryRoute } from "./country.route.js";
import { authRoute } from "./auth.routes.js";
import { eSimPlanRoute } from "./eSimPlan.route.js";
import { otpVerificationRoute } from "./otpVerification.route.js";
import { eSimRoute } from "./eSim.routes.js";
import { cartRoute } from "./userCart.routes.js";

import emailTemplateRoutes from "./email.template.routes.js";
import emailRoutes from "./email.routes.js";
import userRoutes from "./user.routes.js";
import paymentGatewayRoutes from "./payment.gateway.routes.js";
import paymentRoutes from "./payment.routes.js";

const router = Router({ mergeParams: true });

router.use("/user", userRoute);
router.use("/country", countryRoute);
router.use("/auth", authRoute);
router.use("/eSimPlan", eSimPlanRoute);
router.use("/otp-verification", otpVerificationRoute);
router.use("/eSim", eSimRoute);
router.use("/payment", paymentGatewayRoutes);
router.use("/cart", cartRoute);

// managed by Naveed Sarohani (naveed.sarohani@gmail.com)
router.use("/paymentSave", paymentRoutes)
router.use("/x-users", userRoutes)
router.use("/email", emailRoutes)
router.use("/email-templates", emailTemplateRoutes)

export { router };
