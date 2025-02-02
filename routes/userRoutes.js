const express = require("express");
const router = express.Router();

router.post("/register", (req, res) => {
  res.send("User registration");
});

router.post("/login", (req, res) => {
  res.send("User login");
});

module.exports = router;
