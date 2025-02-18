const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authJWT");

const {
  registerUser,
  loginUser,
  logOutUser,
  getUsers,
  getUsersById,
  updateUserById,
  getOwnUserId
} = require("../controllers/userController");
const verifyToken = require("../middleware/authJWT");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getUsers);
router.get("/getOwnUserId",verifyToken, getOwnUserId);
router.get("/:id", getUsersById);
router.put("/:id", updateUserById);
router.post("/logout", logOutUser);

module.exports = router;
