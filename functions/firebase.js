const admin = require("firebase-admin");
const serviceAccount = require("./permissions.json"); // No need for `assert { type: "json" }` in CommonJS

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fsdproject-2f44c-default-rtdb.firebaseio.com",
});

const db = admin.firestore();

module.exports = { db };
