import { Router } from "express";

import { userRoute } from "./routes/user.route.js";
import { countryRoute } from "./routes/country.route.js";
import { authRoute } from "./routes/auth.routes.js";
import { eSimPlanRoute } from "./routes/eSimPlan.route.js";
import { otpVerificationRoute } from "./routes/otpVerification.route.js";
import { eSimRoute } from "./routes/eSim.routes.js";
import { cartRoute } from "./routes/userCart.routes.js";

import emailTemplateRoutes from "./routes/email.template.routes.js";
import emailRoutes from "./routes/email.routes.js";
import userRoutes from "./routes/user.routes.js";
import paymentGatewayRoutes from "./routes/payment.gateway.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import settingRoutes from "./routes/setting.routes.js";

// registered routes
const apiRoutes = Router({ mergeParams: true });

// register routes
apiRoutes.use("/user", userRoute);
apiRoutes.use("/country", countryRoute);
apiRoutes.use("/auth", authRoute);
apiRoutes.use("/eSimPlan", eSimPlanRoute);
apiRoutes.use("/otp-verification", otpVerificationRoute);
apiRoutes.use("/eSim", eSimRoute);
apiRoutes.use("/payment", paymentGatewayRoutes);
apiRoutes.use("/cart", cartRoute);
apiRoutes.use("/paymentSave", paymentRoutes);
apiRoutes.use("/users", userRoutes);
apiRoutes.use("/email", emailRoutes);
apiRoutes.use("/email-templates", emailTemplateRoutes);
apiRoutes.use("/settings", settingRoutes);

// export to register
export default apiRoutes;
