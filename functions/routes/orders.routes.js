const express = require("express");
const { 
  createOrder, 
  getOrdersByUser, 
  deleteOrder, 
  order, 
  createOrderByServiceId 
} = require("../controllers/orders.controller.js"); // Add .js extension

const router = express.Router();

// Create a new order
router.post("/order", order);

router.post("/create", createOrder);

router.post("/createOrderByServiceId/:id", createOrderByServiceId);

// Get all orders by a user
router.get("/getOrders/:uid", getOrdersByUser);

// Delete an order
router.delete("/delete/:orderId", deleteOrder);

module.exports = router;
