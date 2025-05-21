import Stripe from "stripe";
import paypal from "paypal-rest-sdk";
import transactionService from "../services/transaction.service.js";
import { payments } from "../../config/env.js";
import { paypalAxios } from "./payment.gateway.controller.js";
import userService from "../services/user.service.js";
import paymentService from "../services/payment.service.js";
import axiosInstance from "../../utils/helpers/axios.instance.js";

const balance = async (req, res) => {
    try {
        const { balance } = req.user;
        return res.response(200, "Your current wallet balance", { balance });
    } catch (error) {
        return res.response(500, "Internal server error", { error: error.message });
    }
};

const deposit = async (req, res) => {
    try {
        const { transactionId, amount, currency } = req.body;
        const { id: userId, balance } = req.user;
        const updatedBalance = (parseFloat(balance) + parseFloat(amount));

        const user = await userService.update(userId, { balance: updatedBalance });
        if (!user) throw new Error("Failed to update wallet with newly deposited funds");

        const source = transactionId.includes("pi_") ? "STRIPE" : "PAYPAL";
        const transaction = await transactionService.create({
            userId, transactionId, amount, currency, source
        });
        if (!transaction) throw new Error("Failed to push transaction history");

        return res.response(200, "Funds have been added to your wallet", { balance: updatedBalance });
    } catch (error) {
        return res.response(500, "Internal server error", { error: error.message });
    }
};

const useFunds = async (req, res) => {
    try {
        const { transactionId, amount, currency } = req.body;
        const { id: userId, balance } = req.user;
        const updatedBalance = (parseFloat(balance) - parseFloat(amount));

        const user = await userService.update(userId, { balance: updatedBalance });
        if (!user) throw new Error("Failed to deduct funds from the wallet");

        const transaction = await transactionService.create({
            userId, transactionId, amount, currency, source: "WALLET", type: "PURCHASE"
        });
        if (!transaction) throw new Error("Failed to push transaction history");

        return res.response(200, "Purchase was successful, amount deducted", { balance: updatedBalance });
    } catch (error) {
        return res.response(500, "Internal server error", { error: error.message });
    }
};

const cancelAndRefund = async (req, res) => {
    try {
        const { esimTranNo, transactionId } = req.body;

        const payment = await paymentService.retrieveOne({ transactionId });
        if (!payment) return res.response(404, "Payment not found with provided transaction ID");

        const esim = await axiosInstance.post("/esim/cancel", { esimTranNo });
        if (esim.data?.success == false) {
            return res.response(400, "Failed to cancel the profile.", { error: esim.data?.errorCode });
        };

        const { id: userId, balance } = req.user;
        const updatedBalance = (parseFloat(balance) + parseFloat(payment.amount / 10000));

        const user = await userService.update(userId, { balance: updatedBalance });
        if (!user) throw new Error("Failed to make re-fund");

        const source = transactionId.includes("pi_") ? "STRIPE" : "PAYPAL";
        const transaction = await transactionService.create({
            userId, transactionId, amount: payment.amount / 10000, currency: payment.currency, source, type: "REFUND"
        });
        if (!transaction) throw new Error("Failed to push transaction history");

        return res.response(200, "The amount has been refunded", { balance: updatedBalance });
    } catch (error) {
        return res.response(500, "Internal server error", { error: error.message });
    }
};

const stripe = new Stripe(payments.stripe.secretKey);
const stripeDeposit = async (req, res) => {
    try {
        const { amount, currency = "USD" } = req.body;

        if (!amount || !currency) {
            return res.response(400, "amount and currency are required");
        }

        const { client_secret } = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), currency, payment_method_types: ["card"],
        });

        return res.response(200, "Strip payment intent created", { clientSecret: client_secret });
    } catch (error) {
        return res.response(500, "Internal server error", { error: error.message });
    }
};

const generatePaypalOrderDeposit = async (req, res) => {
    try {
        const { amount, currency: currency_code } = req.body;

        if (!amount || !currency_code) {
            return res.response(400, "amount and currency are required");
        }

        const { data } = await paypalAxios.post("/v2/checkout/orders", {
            intent: "CAPTURE",
            purchase_units: [{
                amount: { currency_code, value: amount }
            }],
        });

        return res.response(200, "Paypal deposit funds captured", { orderId: data.id, currency_code })
    } catch (error) {
        return res.response(500, "Internal server error", { error: error.message });
    }
};

const capturePaypalOrderDeposit = async (req, res) => {
    try {
        const { orderId } = req.body;
        const { data } = await paypalAxios.post(`/v2/checkout/orders/${orderId}/capture`);

        return res.response(200, "Funds has been added to your wallet", { transactionId: data.id, });
    } catch (error) {
        return res.response(500, "Internal server error", { error: error.message });
    }
};

const stripeDepositFromNative = async (req, res) => {
    try {
        const { amount, currency } = req.body;

        const customer = await stripe.customers.create();
        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customer.id }, { apiVersion: '2025-04-30.basil' }
        );

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), currency,
            customer: customer.id,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return res.response(200, "Strip payment intent created", {
            transactionId: paymentIntent.id,
            paymentIntent: paymentIntent.client_secret,
            ephemeralKey: ephemeralKey.secret,
            customer: customer.id,
            publishableKey: payments.stripe.publicKey
        });
    } catch (error) {
        ForNative
        return res.response(500, "Internal server error", { error: error.message });
    }
};

// configure paypal for payments from mobile app
paypal.configure({
    mode: payments.paypal.mode,
    client_id: payments.paypal.clientKey,
    client_secret: payments.paypal.secretKey,
});

const paypalCaptureOrderFailedFromNative = async (req, res) => (
    res.redirect('https://success.com/payment-failure')
);

const generatePaypalOrderDepositFromNative = async (req, res) => {
    try {
        const { amount, currency } = req.body;

        if (!amount || !currency) {
            return res.response(400, "Amount and currency are required");
        }

        const create_payment_json = {
            intent: "sale",
            payer: { payment_method: "paypal" },
            redirect_urls: {
                return_url: `https://dev.roamdigi.com/api/wallet/paypal-native/capture-order/add-funds?userId=${req.user._id}`,
                cancel_url: `https://dev.roamdigi.com/api/wallet/paypal-native/capture-order/failed?userId=${req.user._id}`,
            },
            transactions: [{
                amount: { total: amount, currency },
                description: "Credit wallet from native",
            }],
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                return res.response(500, "Error in payment creation");
            } else {
                if (payment.state === "created") {
                    const approval_url = payment.links.find((link) => link.rel === "approval_url").href;
                    return res.response(200, "Payment created successfully", { approvalUrl: approval_url, paymentId: payment.id });
                } else {
                    return res.response(500, "Payment not created successfully");
                }
            }
        });
    } catch (error) {
        return res.response(500, "Internal server error", { error: error.message });
    }
};

const capturePaypalOrderDepositFromNative = async (req, res) => {
    try {
        const { paymentId, userId } = req.query;

        const execute_payment_json = {
            payer_id: PayerID,
        };

        paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
            if (error || !payment || payment.state !== "approved") {
                throw new Error(error);
            }

            const transactionData = payment.transactions[0];
            const amount = parseFloat(transactionData.amount.total);
            const currency = transactionData?.amount?.currency ?? "USD";
            const transactionId = payment?.cart;

            let user = await userService.retrieveOne({ _id: userId });
            if (!user) return res.redirect('https://success.com/payment-failure');

            const updatedBalance = (user.balance + amount);

            user = await userService.update(userId, { balance: updatedBalance });
            if (!user) throw new Error("Failed to update wallet with newly deposited funds");

            const transaction = await transactionService.create({
                transactionId, amount, currency, source: "PAYPAL"
            });
            if (!transaction) throw new Error("Failed to push transaction history");

            return res.redirect('https://success.com/payment-success');
        });
    } catch (error) {
        return res.redirect('https://success.com/payment-failure')
    }
};

export default {
    balance, deposit, useFunds, cancelAndRefund,
    stripeDeposit, stripeDepositFromNative,
    generatePaypalOrderDeposit, capturePaypalOrderDeposit,
    generatePaypalOrderDepositFromNative, capturePaypalOrderDepositFromNative,
    paypalCaptureOrderFailedFromNative
};
