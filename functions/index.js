import functions from "firebase-functions";
import express from "express";
import cors from "cors";
import exampleRoutes from "./routes/example.routes.js";
import usersRoutes from "./routes/users.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import ordersRoutes from "./routes/orders.routes.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: true }));

app.get("/hello-world", (req, res) => {
  return res.status(200).send("Hello World");
});

app.use("/api/example", exampleRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", ordersRoutes);

export const napi = functions.https.onRequest(app);
