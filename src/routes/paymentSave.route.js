import { Router } from "express";
import { esimWebHook, getMyPaymentsInfo, paymentStore } from "../controllers/paymentSave.controller.js";
import {auth} from "../middeware/auth.js"


const paymentSaveRoute = Router();


paymentSaveRoute.route("/store").post(auth, paymentStore); 
paymentSaveRoute.route("/getMyPaymentInfo").get(auth, getMyPaymentsInfo);
paymentSaveRoute.route("/webhook/esimNotification").post( esimWebHook);


export { paymentSaveRoute };