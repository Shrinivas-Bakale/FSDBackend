const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const exampleRoutes = require("./routes/example.routes.js");
const usersRoutes = require("./routes/users.routes.js");
const cartRoutes = require("./routes/cart.routes.js");
const ordersRoutes = require("./routes/orders.routes.js");

const app = express();

app.use(express.json());
app.use(cors({ origin: ["http://localhost:5174", "http://127.0.0.1:5001"] }));

app.get("/hello-world", (req, res) => {
  return res.status(200).send("Hello World");
});

app.use("/api/example", exampleRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", ordersRoutes);

exports.napi = functions.https.onRequest(app); // Use `exports` in CommonJS
