import paypal from "@paypal/checkout-server-sdk";

import {
  PAYPAL_MODE,
  PAYPAL_CLIENT_KEY,
  PAYPAL_SECRET_KEY,
} from "../config/env.js";

// Set up and configure PayPal environment
// function environment() {
//   return PAYPAL_MODE === "live"
//     ? new paypal.core.LiveEnvironment(PAYPAL_CLIENT_KEY, PAYPAL_SECRET_KEY)
//     : new paypal.core.SandboxEnvironment(PAYPAL_CLIENT_KEY, PAYPAL_SECRET_KEY);
// }

// function client() {
//   return new paypal.core.PayPalHttpClient(environment());
// }

// const client = paypal.configure({
//     'mode': 'sandbox',  // live
//     'client_id': 'yourclientid',
//     'client_secret': 'yoursecretkey'
// });

export { client };
