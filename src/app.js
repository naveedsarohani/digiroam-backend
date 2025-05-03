import { Router } from "express";

import { userRoute } from "./routes/user.route.js";
import { eSimRoute } from "./routes/eSim.routes.js";
import { cartRoute } from "./routes/userCart.routes.js";

import authRoutes from "./routes/auth.routes.js";
import countryRoutes from "./routes/country.routes.js";
import esimPlanRoutes from "./routes/esim.plan.routes.js";
import otpVerificationRoutes from "./routes/otp.verification.routes.js";
import emailTemplateRoutes from "./routes/email.template.routes.js";
import emailRoutes from "./routes/email.routes.js";
import userRoutes from "./routes/user.routes.js";
import paymentGatewayRoutes from "./routes/payment.gateway.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import settingRoutes from "./routes/setting.routes.js";
import FavouritePlanRoutes from "./routes/favourite.plans.routes.js";
import buynowRoutes from "./routes/buynow.routes.js";

// registered routes
const apiRoutes = Router({ mergeParams: true });

// register routes
apiRoutes.use("/user", userRoute);
apiRoutes.use("/countries", countryRoutes);
apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/esim-plans", esimPlanRoutes);
apiRoutes.use("/otp-verification", otpVerificationRoutes);
apiRoutes.use("/eSim", eSimRoute);
apiRoutes.use("/payment", paymentGatewayRoutes);
apiRoutes.use("/buynow", buynowRoutes);
apiRoutes.use("/cart", cartRoute);
apiRoutes.use("/paymentSave", paymentRoutes);
apiRoutes.use("/users", userRoutes);
apiRoutes.use("/email", emailRoutes);
apiRoutes.use("/email-templates", emailTemplateRoutes);
apiRoutes.use("/settings", settingRoutes);
apiRoutes.use("/favourite-plans", FavouritePlanRoutes);

// export to register
export default apiRoutes;
