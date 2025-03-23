import paymentService from "../services/payment.service.js";
import filterRequestBody from "../../utils/helpers/filter.request.body.js";
import Cart from "../models/cart.model.js";
import emailOnEvent from "../../utils/helpers/email.on.event.js";

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
                await emailOnEvent.orderPurchase(orderNo, payment.userId); break;

            case "ESIM_STATUS":
                if (esimStatus === "CANCEL" || smdpStatus === "RELEASED") {
                    await emailOnEvent.orderCencel(iccid, payment.userId);
                    payment.status = "CANCELLED";
                } else if (esimStatus === "IN_USE") {
                    payment.status = "COMPLETED";
                } break;

            case "DATA_USAGE":
                const consumedPercentage = ((totalVolume - remain) / totalVolume) * 100;
                if (consumedPercentage >= 79 && consumedPercentage <= 89) {
                    await emailOnEvent.orderUsage(payment.userId);
                } break;

            case "VALIDITY_USAGE":
                await emailOnEvent.orderValidity(content, payment.userId);
                break;

            default:
                console.log(`Unhandled notifyType: ${notifyType}`);
                break;
        }

        await paymentService.update(payment._id, { status: payment.status });
        return res.response(200, "OK");
    } catch (error) {
        return res.response(500, "Internal Server Error");
    }
}

export default { store, payments, webHook }
