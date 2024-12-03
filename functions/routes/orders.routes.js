import express from "express";
import { createOrder, getOrdersByUser, deleteOrder, order } from "../controllers/orders.controller.js";

const router = express.Router();

// Create a new order
router.post("/order", order);

router.post("/create", createOrder);

// Get all orders by a user
router.get("/getOrders/:uid", getOrdersByUser);

// Delete an order
router.delete("/delete/:orderId", deleteOrder);

export default router;
