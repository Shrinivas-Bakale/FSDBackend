const express = require("express");
const {
  createUser,
  getAllUsers,
  getUserById,
} = require("../controllers/users.controller.js"); // Add .js extension

const router = express.Router();

router.post("/createUser", createUser);
router.get("/getAllUsers", getAllUsers);
router.get("/getUserById/:id", getUserById);

module.exports = router;
