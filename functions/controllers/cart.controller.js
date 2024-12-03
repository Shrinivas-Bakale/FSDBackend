import { db } from "../firebase.js";
import { deleteDoc, doc } from "firebase/firestore";

export const addToCart = async (req, res) => {
  try {
    const { userid } = req.params;
    const { serviceId, quantity } = req.body; // { serviceId: "abc123", quantity: 1 }

    console.log(userid);
    if (!userid || typeof userid !== "string") {
      return res.status(400).send({ error: "Invalid userid" });
    }

    if (!serviceId || quantity <= 0) {
      return res.status(400).send({ error: "Invalid serviceId or quantity" });
    }

    if (!serviceId || quantity <= 0) {
      return res.status(400).send({ error: "Invalid serviceId or quantity" });
    }

    // Reference to the user's cart
    const cartRef = db.collection("carts").doc(userid);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists) {
      // If no cart exists, create one
      await cartRef.set({
        cartItems: [{ serviceId, quantity }],
      });
    } else {
      const cartData = cartDoc.data();
      const existingItemIndex = cartData.cartItems.findIndex(
        (item) => item.serviceId === serviceId
      );

      if (existingItemIndex >= 0) {
        // Update quantity if the item already exists
        cartData.cartItems[existingItemIndex].quantity += quantity;
      } else {
        // Add new service to cart
        cartData.cartItems.push({ serviceId, quantity });
      }

      await cartRef.update({ cartItems: cartData.cartItems });
    }

    res.status(200).send({ message: "Item added to cart successfully!" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).send({ error: "Failed to add item to cart" });
  }
};

export const getCartItems = async (req, res) => {
  try {
    const { userid } = req.params;

    const cartRef = db.collection("carts").doc(userid);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists) {
      return res.status(404).send({ error: "Cart not found" });
    }

    const cartData = cartDoc.data();
    const servicePromises = cartData.cartItems.map((item) =>
      db.collection("services").doc(item.serviceId).get()
    );

    const serviceDocs = await Promise.all(servicePromises);

    const cartWithDetails = cartData.cartItems.map((item, index) => {
      const service = serviceDocs[index].data();
      return {
        id: item.serviceId,
        ...service,
        quantity: item.quantity,
      };
    });

    res.status(200).send(cartWithDetails);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).send({ error: "Failed to fetch cart" });
  }
};

export const removeFromCart = async (req, res) => {
  const { userid, serviceid } = req.params;
  console.log(userid, serviceid);
  try {
    const { userid, serviceid } = req.params;

    // Reference the user's cart document
    const cartRef = doc(db, "carts", userid);
    console.log(cartRef);
    // Fetch the current cart document
    const cartDoc = await getDoc(cartRef);
    console.log(cartDoc);
    if (!cartDoc.exists()) {
      return res.status(404).send({ error: "Cart not found" });
    }

    // Get the current cartItems array
    const cartData = cartDoc.data();
    const updatedCartItems = cartData.cartItems.filter(
      (item) => item.serviceId !== serviceid
    );

    // Update the cartItems field in Firestore
    await updateDoc(cartRef, { cartItems: updatedCartItems });

    res.status(200).send({ message: "Item removed from cart successfully!" });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).send({ error: "Failed to remove item from cart" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { userid } = req.params;

    await db.collection("carts").doc(userid).delete();

    res.status(200).send({ message: "Cart cleared successfully!" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).send({ error: "Failed to clear cart" });
  }
};
