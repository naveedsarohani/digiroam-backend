import { Router } from "express";
import {
  getDataPackages,
  getBalance,
  // orderProfiles,
  allocatedProfiles,
  cancelProfile,
  suspendProfile,
  unsuspendProfile,
  revokeProfile,
  topUp,
  sendSms
} from "../controllers/eSimExternal.controller.js";
import externalEsimPlanController from "../app/controllers/external.esim.plan.controller.js";
import schema from "../app/middlewares/schema.js";

import {
  dataPackagesSchema,
  orderProfileSchema,
  allocatedProfileSchema,
  cancelProfileSchema,
  suspendProfileSchema,
  unsuspendProfileSchema,
  revokeProfileSchema,
  topUpSchema,
  sendSmsSchema,
} from "../validators/esim.validator.js";

const eSimRoute = Router();

eSimRoute.route("/getPackages").post(schema.validator(dataPackagesSchema), getDataPackages);
eSimRoute.route("/getBalance").post(getBalance);
eSimRoute.route("/orderProfiles").post(schema.validator(orderProfileSchema), externalEsimPlanController.orderEsims);
eSimRoute.route("/allocatedProfiles").post(schema.validator(allocatedProfileSchema), allocatedProfiles);
eSimRoute.route("/cancelProfile").post(schema.validator(cancelProfileSchema), cancelProfile);
eSimRoute.route("/suspendProfile").post(schema.validator(suspendProfileSchema), suspendProfile);
eSimRoute.route("/unsuspendProfile").post(schema.validator(unsuspendProfileSchema), unsuspendProfile);
eSimRoute.route("/revokeProfile").post(schema.validator(revokeProfileSchema), revokeProfile);
eSimRoute.route("/topUp").post(schema.validator(topUpSchema), topUp);
eSimRoute.route("sendSms").post(schema.validator(sendSmsSchema), sendSms);

export { eSimRoute };
