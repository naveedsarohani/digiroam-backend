import axios from "axios";
import Stripe from "stripe";
import paypal from "paypal-rest-sdk";

import Cart from "../models/cart.model.js";
import { payments } from "../../config/env.js";
import axiosInstance from "../../utils/helpers/axios.instance.js";
import settingService from "../services/setting.service.js";
import getPriceWithMarkup from "../../utils/helpers/get.price.with.markup.js";
import paymentService from "../services/payment.service.js";
import Buynow from "../models/buynow.model.js";

// configure paypal for payments from mobile app
paypal.configure({
    mode: payments.paypal.mode,
    client_id: payments.paypal.clientKey,
    client_secret: payments.paypal.secretKey,
});

const paypalPaymentUrlHandler = async (req, res) => (
    res.redirect('https://success.com/payment-failure')
);

// Create a PayPal payment
const generatePaypalForNative = async (req, res) => {
    const { amount, currency, type = "cart" } = req.body;

    if (!amount || !currency) {
        return res.response(400, "Amount and currency are required");
    }

    const create_payment_json = {
        intent: "sale",
        payer: { payment_method: "paypal" },
        redirect_urls: {
            return_url: `https://dev.roamdigi.com/api/payment/paypal/native/execute-payment?userId=${req.user._id}&type=${type}`,
            cancel_url: `https://dev.roamdigi.com/api/payment/paypal/native/cancel?userId=${req.user._id}&type=${type}`,
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
    try {
        const { paymentId, PayerID, userId, type } = req.query;

        const execute_payment_json = {
            payer_id: PayerID,
        };

        paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
            if (error || !payment || payment.state !== "approved") {
                throw new Error(error);
            }

            const transactionId = payment?.cart;
            const currency = payment?.transactions[0]?.amount?.currency

            const { markup, amount, packageInfoList, isEmpty } = await retrieveCart(userId, type);
            if (isEmpty) throw new Error("The cart/buynow is empty");

            const { data } = await axiosInstance.post("/esim/order", {
                transactionId, amount: String(amount), packageInfoList
            });
            if (data?.success === false) throw new Error("failed to purchase eSim");

            const { failed } = await savePurchaseAndRemoveCart(userId, markup, {
                transactionId, currency, amount, packageInfoList, orderNo: data.obj.orderNo
            }, type);
            if (failed) throw new Error("Failed to save payment or clearing cart");

            return res.redirect('https://success.com/payment-success');
        });
    } catch (error) {
        console.log(error);
        console.log("error-message", error.message);
        return res.redirect('https://success.com/payment-failure')
    }
};

const stripe = new Stripe(payments.stripe.secretKey);
export const stripePaymentIntentForNative = async (req, res) => {
    try {
        const { amount, currency } = req.body;

        const customer = await stripe.customers.create();
        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customer.id }, { apiVersion: '2025-04-30.basil' }
        );

        // const { markup, amount, packageInfoList, isEmpty } = await retrieveCart(req.user._id);
        // if (isEmpty) throw new error("Cart is empty");

        // const paymentAmount = packageInfoList.reduce((total, { price, count }) => (
        //     total + getPriceWithMarkup(price / 10000, markup) * count
        // ), 0).toFixed(2);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), currency,
            customer: customer.id,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        // const transactionId = paymentIntent.id;
        // const { data } = await axiosInstance.post("/esim/order", {
        //     transactionId, amount: String(amount), packageInfoList
        // });
        // if (data?.success === false) {
        //     console.log(data);
        //     throw new Error("failed to make purchase eSim");
        // };

        // const { failed } = await savePurchaseAndRemoveCart(userId, markup, {
        //     transactionId, currency: "USD", amount, packageInfoList, orderNo: data.obj.orderNo
        // });
        // if (failed) throw new Error("failed to save payment or clearing cart");

        return res.response(200, "PaymentIntent created", {
            transactionId: paymentIntent.id,
            paymentIntent: paymentIntent.client_secret,
            ephemeralKey: ephemeralKey.secret,
            customer: customer.id,
            publishableKey: payments.stripe.publicKey
        });
    } catch (error) {
        console.error("Stripe PaymentIntent Error:", error);
        return res.response(400, "Failed to create PaymentIntent", { error: error.message });
    }
};

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

        if (!amount || !currency_code) {
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
            payer: data.payer,
            packageInfoList
        });

    } catch (error) {
        return res.response(500, "Failed make payment", { error: error.message });
    }
};

// utility function to retrieve paypal access token
const retrieveCart = async (userId, type = "cart") => {
    try {
        const { pricePercentage } = await settingService.retrieve();

        let packageInfoList = [];
        let amount = 0;

        if (type == "cart") {
            const cart = await Cart.findOne({ userId });

            if (!cart || cart.items.length === 0 || !pricePercentage) {
                throw new Error("Cart is empty or price percentage not retrieved");
            }
            packageInfoList = cart.items.map((item) => ({
                packageCode: item.productId,
                count: item.productQuantity,
                price: item.productPrice * 10000,
            }));

            amount = cart.totalPrice * 10000
        } else {
            const buynow = await Buynow.findOne({ userId });

            if (!buynow || !pricePercentage) {
                throw new Error("Buynow is empty or price percentage not retrieved");
            }

            const { packageCode, price, count } = buynow;
            packageInfoList = [{ packageCode, price: price * 10000, count }];

            amount = packageInfoList[0].price;
        }

        return {
            markup: pricePercentage,
            amount, packageInfoList,
            isEmpty: false
        };
    } catch (error) {
        throw error;
    }
}

const savePurchaseAndRemoveCart = async (userId, markup, data, type = "cart") => {
    try {
        if ((await paymentService.retrieveOne({ transactionId: data.transactionId }))) {
            throw new Error("Payment exists");
        }

        data.packageInfoList = data.packageInfoList?.map((pkg) => (
            { ...pkg, price: (getPriceWithMarkup(pkg.price / 10000, markup) * 10000) }
        ));

        if (type == "cart") {
            data.amount = data.packageInfoList.reduce((total, { price, count }) => (
                total + Number(getPriceWithMarkup(price / 10000, markup) * 10000).toFixed(2) * count
            ), 0);
        } else {
            data.amount = data.packageInfoList[0].price
        }

        if (!(await paymentService.create({ userId, ...data }))) {
            throw new Error("Payment exists");
        }

        if (type == "cart") {
            await Cart.findOneAndDelete({ userId });
        } else {
            await Buynow.findOneAndDelete({ userId });
        }

        return { failed: false }
    } catch (error) {
        throw error;
    }
}

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
    stripePaymentIntent,
    stripePaymentIntentForNative
};