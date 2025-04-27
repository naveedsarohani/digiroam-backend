import axios from "axios";
import Stripe from "stripe";
import paypal from "paypal-rest-sdk";

import Cart from "../models/cart.model.js";
import { payments } from "../../config/env.js";

// configure paypal for payments from mobile app
paypal.configure({
    mode: payments.paypal.mode,
    client_id: payments.paypal.clientKey,
    client_secret: payments.paypal.secretKey,
});

const paypalPaymentUrlHandler = async (req, res) => {
    try {
        // return res.response(200, `The payment was ${req.params.status}`)
        return res.redirect('https://success.com/payment-failure');
    } catch (error) {
        // return res.response(500, `The payment was failed`, { error: error.message });
        return res.redirect('https://success.com/payment-failure');
    }
}

// Create a PayPal payment
const generatePaypalForNative = async (req, res) => {
    const { amount, currency } = req.body;

    if (!amount || !currency) {
        return res.response(400, "Amount and currency are required");
    }

    const create_payment_json = {
        intent: "sale",
        payer: { payment_method: "paypal" },
        redirect_urls: {
            return_url: "https://dev.roamdigi.com/api/payment/paypal/native/execute-payment",
            cancel_url: "https://dev.roamdigi.com/api/payment/paypal/native/cancel",
        },
        transactions: [{
            amount: { total: amount, currency },
            description: "Payment from native",
        }],
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            console.log(error);
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
};

// Capture PayPal payment after user approves
const capturePaypalForNative = async (req, res) => {
    console.log(req);
    console.log("JSON", JSON.stringify(req));
    const { paymentId, PayerID } = req.query;

    const execute_payment_json = {
        payer_id: PayerID,
    };

    paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
        if (error) {
            console.log(error);
            return res.redirect('https://success.com/payment-failure');
        } else {
            if (payment.state === "approved") {

                const { amount, packageInfoList } = await retrieveCart();
                return res.redirect('https://success.com/payment-success');
            } else {
                return res.redirect('https://success.com/payment-failure');
            }
        }
    });
};

const retrieveCart = async () => {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart || cart.items.length === 0) {
        return res.response(400, "There is no eSim or package carted to proceed with")
    }

    const packageInfoList = cart.items.map((item) => ({
        packageCode: item.productId,
        count: item.productQuantity,
        price: item.productPrice * 10000,
    }));

    return res.response(200, "Payment was successful", {
        currency_code,
        transactionId: data.id,
        amount: cart.totalPrice * 10000,
        currency_code: "USD",
        payer: data.payer,
        packageInfoList
    });

}

const stripe = new Stripe(payments.stripe.secretKey);
const stripePaymentIntent = async (req, res) => {
    try {
        const { amount, currency = "usd", items } = req.body;

        const { client_secret } = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency,
            metadata: { items: JSON.stringify(items) },
            payment_method_types: ["card"],
        });

        return res.response(200, "Payment was successful", { clientSecret: client_secret });
    } catch (error) {
        return res.response(500, "Failed to make payment", { error: error.message });
    }
};

const generatePaypalOrder = async (req, res) => {
    try {
        const { amount, currency: currency_code } = req.body;

        if (!amount || !currency) {
            return res.response(400, "Amount and currency are required");
        }

        const { data } = await paypalAxios.post("/v2/checkout/orders", {
            intent: "CAPTURE",
            purchase_units: [{
                amount: { currency_code, value: amount }
            }],
        });

        return res.response(200, "Order has been created", { orderId: data.id, currency_code })
    } catch (error) {
        return res.response(500, "Failed to create PayPal order", { error: error.message });
    }
};

const capturePaypalOrder = async (req, res) => {
    try {
        const { orderId, currency_code } = req.body;

        const { data } = await paypalAxios.post(`/v2/checkout/orders/${orderId}/capture`);

        const cart = await Cart.findOne({ userId: req.user._id });

        if (!cart || cart.items.length === 0) {
            return res.response(400, "There is no eSim or package carted to proceed with")
        }

        const packageInfoList = cart.items.map((item) => ({
            packageCode: item.productId,
            count: item.productQuantity,
            price: item.productPrice * 10000,
        }));

        return res.response(200, "Payment was successful", {
            currency_code,
            transactionId: data.id,
            amount: cart.totalPrice * 10000,
            currency_code: "USD",
            payer: data.payer,
            packageInfoList
        });

    } catch (error) {
        return res.response(500, "Failed make payment", { error: error.message });
    }
};

// utility function to retrieve paypal access token
const retrievePaypalAccessToken = async () => {
    try {
        const response = await axios({
            url: `${payments.paypal.baseUrl}/v1/oauth2/token`,
            method: "post",
            auth: {
                username: payments.paypal.clientKey,
                password: payments.paypal.secretKey,
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: "grant_type=client_credentials",
        });
        return response.data.access_token;
    } catch (error) {
        throw error;
    }
};

// axios service for handling paypal payments requests
const paypalAxios = axios.create({
    baseURL: payments.paypal.baseUrl,
    headers: {
        Authorization: `Bearer ${await retrievePaypalAccessToken()}`,
        "Content-Type": "application/json",
    },
});


export default {
    paypalPaymentUrlHandler,
    generatePaypalForNative,
    capturePaypalForNative,
    generatePaypalOrder,
    capturePaypalOrder,
    stripePaymentIntent
};