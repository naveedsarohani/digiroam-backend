import { Router } from "express";
import { addToCart, clearCart, getCartDetails, removeFromCart } from "../controllers/userCart.controller.js";

import auth from "../app/middlewares/auth.js";

const cartRoute = Router({ mergeParams: true });

cartRoute.route("/getCartDetails").get(auth.authenticate, getCartDetails);
cartRoute.route("/addToCart").post(auth.authenticate, addToCart);
cartRoute.route("/removeFromCart").post(auth.authenticate, removeFromCart);
cartRoute.route("/clearCart").post(auth.authenticate, clearCart);

export { cartRoute };