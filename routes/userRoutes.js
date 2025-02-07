const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logOutUser,
  getUsers,
  getUsersById,
  updateUserById
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getUsers);
router.get("/:id", getUsersById);
router.put("/:id", updateUserById);
router.post("/logout", logOutUser);

module.exports = router;
