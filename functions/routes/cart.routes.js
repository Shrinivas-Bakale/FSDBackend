import express from "express";
import {
  addToCart,
  getCartItems,
  removeFromCart,
  clearCart
} from "../controllers/cart.controller.js"; // Add .js extension

const router = express.Router();

router.post("/addToCart/:userid", addToCart);
router.get("/getCartItems/:userid", getCartItems);
router.delete("/removeFromCart/:userid/:serviceid", removeFromCart);
router.delete("/removeFromCart/:userid", clearCart);

export default router;
