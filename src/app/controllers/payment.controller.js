import paymentService from "../services/payment.service.js";
import filterRequestBody from "../../utils/helpers/filter.request.body.js";
import Cart from "../models/cart.model.js";
import { sendOrderEmail, sendCencelEmail } from "../../utils/helpers/email.on.event.js";

const store = async (req, res) => {
    try {
        const data = filterRequestBody(req.body,
            ["transactionId", "amount", "currency", "payer", "packageInfoList", "orderNo"]
        );

        if ((await paymentService.retrieveOne({ transactionId: data.transactionId }))) {
            return res.response(409, "Payment with this transaction ID already exists");
        }

        const payment = await paymentService.create({ userId: req.user._id, ...data });
        if (!payment) return res.response(400, "Failed to save payment details");

        await Cart.findOneAndDelete({ userId: req.user._id });
        await sendOrderEmail(data.orderNo, req.user);

        return res.response(201, "Payment stored successfully, and cart cleared");
    } catch (error) {
        return res.response(500, "Internal server error", { error: error.message });
    }
}

const payments = async (req, res) => {
    try {
        const myPayments = await paymentService.retrieveMany({ userId: req.user._id });
        return res.response(200, "Retrieved all your payments", { myPayments });
    } catch (error) {
        return res.response(400, "Failed to retrieve your payments", { error: error.message });
    }
}

const webHook = async (req, res) => {
    try {
        const { notifyType, content } = req.body;
        const { orderNo, transactionId, iccid, remain, esimStatus, smdpStatus, totalVolume, expiredTime } = content;

        const payment = await paymentService.retrieveOne({ transactionId });
        if (!payment) return res.response(404, "Payment record not found for the given orderNo");

        switch (notifyType) {
            case "ORDER_STATUS":
                // await sendOrderEmail(orderNo, { name: "Naveed Sarohani", email: "naveed.sarohani@gmail.com" })
                break;

            case "ESIM_STATUS":
                if (esimStatus === "CANCEL" || smdpStatus === "RELEASED") {
                    await sendCencelEmail(iccid, payment.userId);
                    payment.status = "CANCELLED";
                } else if (esimStatus === "IN_USE") {
                    payment.status = "COMPLETED";
                }
                break;

            case "DATA_USAGE":
                console.log(`Data usage alert for eSIM with ICCID ${iccid}. Remaining data: ${remain}MB`);

                break;

            case "VALIDITY_USAGE":
                console.log(`Validity alert for eSIM with ICCID ${iccid}. Remaining days: ${remain}`);

                break;

            default:
                console.log(`Unhandled notifyType: ${notifyType}`);
                break;
        }

        await paymentService.update(payment._id, { status: payment.status });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Webhook processing error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

}

export default { store, payments, webHook }
