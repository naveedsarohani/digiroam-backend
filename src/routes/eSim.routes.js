import { Router } from "express";
import {
  getDataPackages,
  getBalance,
  orderProfiles,
  allocatedProfiles,
  cancelProfile,
  suspendProfile,
  unsuspendProfile,
  revokeProfile,
  topUp,
  sendSms
} from "../controllers/eSimExternal.controller.js";

import { validate } from "../middeware/validation.js";
import {
  dataPackagesSchema,
  orderProfileSchema,
  allocatedProfileSchema,
  cancelProfileSchema,
  suspendProfileSchema,
  unsuspendProfileSchema,
  revokeProfileSchema,
  topUpSchema,
  webhookSchema,
  sendSmsSchema,
} from "../validators/esim.validator.js";

const eSimRoute = Router();

eSimRoute.route("/getPackages").post(validate(dataPackagesSchema),getDataPackages);
eSimRoute.route("/getBalance").post(getBalance);
eSimRoute.route("/orderProfiles").post(validate(orderProfileSchema), orderProfiles);
eSimRoute.route("/allocatedProfiles").post(validate(allocatedProfileSchema), allocatedProfiles);
eSimRoute.route("/cancelProfile").post(validate(cancelProfileSchema), cancelProfile);
eSimRoute.route("/suspendProfile").post(validate(suspendProfileSchema), suspendProfile);
eSimRoute.route("/unsuspendProfile").post(validate(unsuspendProfileSchema), unsuspendProfile);
eSimRoute.route("/revokeProfile").post(validate(revokeProfileSchema), revokeProfile);
eSimRoute.route("/topUp").post(validate(topUpSchema), topUp);
eSimRoute.route("sendSms").post(validate(sendSmsSchema), sendSms);

export { eSimRoute };
