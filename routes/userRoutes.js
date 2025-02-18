const express = require("express");
const router = express.Router();
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

//POST REQUESTS
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logOutUser);

//GET REQUESTS
router.get("/", getUsers);
router.get("/getOwnUserId",verifyToken, getOwnUserId);
router.get("/:id", getUsersById);

//PUT REQUESTS
router.put("/:id", updateUserById);

module.exports = router;
