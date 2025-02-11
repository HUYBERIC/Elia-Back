const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logOutUser,
  getUsers,
  getUsersById,
  updateUserById,
  getToken,
} = require("../controllers/userController");
const verifyToken = require("../middleware/authJWT");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getUsers);
router.get("/getToken", verifyToken, getToken);
router.get("/:id", getUsersById);
router.put("/:id", updateUserById);
router.post("/logout", logOutUser);

module.exports = router;
