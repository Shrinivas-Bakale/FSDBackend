import { db } from "../firebase.js";

// Add a new order
export const createOrder = async (req, res) => {
  try {
    const { amount, address, timeSlot, uid, paymentStatus } = req.body;

    if (!amount || !address || !timeSlot || !uid || !paymentStatus) {
      return res.status(400).send({ error: "All fields are required" });
    }

    const newOrder = {
      amount,
      address,
      timeSlot,
      uid,
      paymentStatus,
      createdAt: new Date().toISOString(),
    };

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
