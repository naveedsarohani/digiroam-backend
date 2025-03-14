import paymentService from "../services/payment.service.js";
import filterRequestBody from "../../utils/helpers/filter.request.body.js";
import Cart from "../models/cart.model.js";
import email from "../../utils/helpers/email.js";
import axiosInstance from "../../utils/helpers/axios.instance.js";

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
        await sendOrderEmail(payment);

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
                const emailOptions = {
                    subject: `New Order Placed`,
                    text: "ORDER_NO: " + orderNo
                }
                await email.send("naveed.sarohani@gmail.com", emailOptions)
                break;

            case "ESIM_STATUS":
                if (esimStatus === "CANCEL" || smdpStatus === "RELEASED") {
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

const sendOrderEmail = async (payment) => {
    try {
        const user = payment.userId;

        const profiles = await axiosInstance({
            method: "POST", url: "/esim/query", data: {
                orderNo: payment.orderNo, pager: { pageNum: 1, pageSize: 20 }
            }
        });

        if (profiles.data?.success === false) return;
        const data = profiles.data.obj.esimList;

        const emailOptions = {
            subject: `Your Travel eSIM is Ready! Order Confirmation ${payment.orderNo}`,
            customerName: user.name,
            planName: data[0].packageList[0].packageName,
            country: data[0].packageList[0].locationCode,
            days: data[0].totalDuration,
            dataLimit: ((data[0].totalVolume / 1024) / 1024) / 1024,
            supportEmail: "support@roamdigi.com",
            activationGuideLink: "https://roamdigi.com/faqs",
            template: "order.confirm"
        }

        await email.send(user.email, emailOptions);
    } catch (error) {
        throw error;
    }
}

export default { store, payments, webHook }
