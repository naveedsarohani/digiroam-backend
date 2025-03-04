import axios from "axios";
import Stripe from "stripe";
import {Cart} from "../models/cart.model.js"
import { PAYPAL_API_BASE,PAYPAL_CLIENT_KEY,PAYPAL_SECRET_KEY ,STRIPE_SECRET_KEY} from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
// PayPal API base URL
// const PAYPAL_API = process.env.PAYPAL_API_BASE;
// const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
// const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

const stripe = new Stripe(STRIPE_SECRET_KEY);



const getAccessToken = async () => {
  try {
    const response = await axios({
      url: `${PAYPAL_API_BASE}/v1/oauth2/token`,
      method: "post",
      auth: {
        username: PAYPAL_CLIENT_KEY,
        password: PAYPAL_SECRET_KEY,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: "grant_type=client_credentials",
    });
    return response.data.access_token;
  } catch (error) {
    throw new ApiError(
      error.response?.status || 500,
      "Failed to get PayPal access token"
    );
  }
};


const paypalGenerateOrderId = async (req, res, next) => {
  const { amount, currency } = req.body;

  // Validate request body
  if (!amount || !currency) {
    return next(new ApiError(400, "Amount and currency are required."));
  }

  try {
    const accessToken = await getAccessToken();

    const orderResponse = await axios.post(
      `${PAYPAL_API_BASE}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount,
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      success: true,
      orderId: orderResponse.data.id,
      currency_code: currency
    });
  } catch (error) {
    next(
      new ApiError(
        error.response?.status || 500,
        error.response?.data?.message || "Failed to create PayPal order"
      )
    );
  }
};

const payapalcaptureOrder = async (req, res, next) => {
  const { orderId,currency_code} = req.body;

  try {
    const accessToken = await getAccessToken();

    const captureResponse = await axios.post(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const captureData = captureResponse.data;

    // Validate the cart and total amount
    const cart = await Cart.findOne({ userId:req.user._id });

    if (!cart || cart.items.length === 0) {
      throw new ApiError(400, "Cart is empty. Cannot proceed with the order.");
    }

    const packageInfoList = cart.items.map((item) => ({
      packageCode: item.productId,
      count: item.productQuantity,
      price: item.productPrice*1000,
    }));

    const totalAmount = cart.totalPrice*1000;
  
    res.json({
      success: true,
      message: "Payment captured successfully.",
      capture: captureResponse.data,
      currency_code,
      transactionId: captureData.id,
      amount: totalAmount,
      currency_code:"USD",
      payer: captureData.payer,
      packageInfoList
    });
  } catch (error) {
    next(
      new ApiError(
        error.response?.status || 500,
        error.response?.data?.message || error.message || "Failed to capture payment"
      )
    );
  }
};

const stripePaymentIntent = async (req, res) => {
  const { amount, currency, items } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to smallest currency unit
      currency: currency || "usd",
      metadata: {
        items: JSON.stringify(items), // Store items as a stringified JSON object
      },
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

export { paypalGenerateOrderId, payapalcaptureOrder, stripePaymentIntent };




