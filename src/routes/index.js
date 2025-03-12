import { Router } from "express";

import { userRoute } from "./user.route.js";
import { countryRoute } from "./country.route.js";
import { authRoute } from "./auth.routes.js";
import { eSimPlanRoute } from "./eSimPlan.route.js";
import { otpVerificationRoute } from "./otpVerification.route.js";
import { eSimRoute } from "./eSim.routes.js";
import { payment } from "./payment.route.js";
import { cartRoute } from "./userCart.routes.js";
import { paymentSaveRoute } from "./paymentSave.route.js";
import emailTemplateRoutes from "./email.template.routes.js";
import emailRoutes from "./email.routes.js";
import authorizationRoutes from "./authorization.routes.js";

const router = Router();

router.use("/user", userRoute);
router.use("/country", countryRoute);
router.use("/auth", authRoute);
router.use("/eSimPlan", eSimPlanRoute);
router.use("/otp-verification", otpVerificationRoute);
router.use("/eSim", eSimRoute);
router.use("/payment", payment);
router.use("/cart", cartRoute);
router.use("/paymentSave", paymentSaveRoute)

// managed by Naveed Sarohani (naveed.sarohani@gmail.com)
router.use("/authorization", authorizationRoutes)
router.use("/email", emailRoutes)
router.use("/email-templates", emailTemplateRoutes)

export { router };
