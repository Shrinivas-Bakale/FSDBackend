import { db } from "../firebase.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config(); // Ensure environment variables are loaded

export const order = async (req, res) => {
  try {
    // Create Razorpay instance
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Prepare order options
    const { amount } = req.body; // Expecting amount in the request body
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid or missing amount" });
    }

    const options = {
      amount: amount * 100, // Convert to smallest currency unit (paise)
      currency: "INR",
      receipt: `order_rcptid_${Math.floor(Math.random() * 1000000)}`, // Generate a unique receipt ID
    };

    // Create order
    const order = await instance.orders.create(options);

    // Respond with the created order
    res.status(200).json(order);
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
};

// Add a new order
export const createOrder = async (req, res) => {
  try {
    const { amount, address, timeSlot, uid, receiptId } = req.body;

    console.log(amount, address, timeSlot, uid, receiptId);

    if (!amount || !address || !timeSlot || !uid || !receiptId) {
      return res.status(400).send({ error: "All fields are required" });
    }

    // Create the order object
    const newOrder = {
      amount,
      address,
      timeSlot,
      uid,
      receiptId,
      createdAt: new Date().toISOString(),
    };

    // Firestore automatically creates the collection if it doesn't exist when adding the document
    const docRef = await db.collection("orders").add(newOrder);

    res
      .status(201)
      .send({ message: "Order created successfully", orderId: docRef.id });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send({ error: "Failed to create order" });
  }
};


// Get all orders for a user
export const getOrdersByUser = async (req, res) => {
  try {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400).send({ error: "User ID is required" });
    }

    const ordersSnapshot = await db
      .collection("orders")
      .where("uid", "==", uid)
      .get();

    if (ordersSnapshot.empty) {
      return res.status(404).send({ error: "No orders found for this user" });
    }

    const orders = ordersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).send(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send({ error: "Failed to fetch orders" });
  }
};

// Delete an order by ID
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).send({ error: "Order ID is required" });
    }

    const orderRef = db.collection("orders").doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).send({ error: "Order not found" });
    }

    await orderRef.delete();

    res.status(200).send({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).send({ error: "Failed to delete order" });
  }
};
