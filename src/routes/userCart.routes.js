import { Router } from "express";
import { addToCart, clearCart, getCartDetails, removeFromCart } from "../controllers/userCart.controller.js";
import { auth } from "../middeware/auth.js";

const cartRoute = Router();

cartRoute.route("/getCartDetails").get(auth, getCartDetails);
cartRoute.route("/addToCart").post(auth, addToCart);
cartRoute.route("/removeFromCart").post(auth, removeFromCart);
cartRoute.route("/clearCart").post(auth, clearCart);

export { cartRoute };