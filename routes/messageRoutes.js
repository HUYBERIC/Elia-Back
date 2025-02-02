const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  res.send("Send a message");
});

router.get("/:id", (req, res) => {
  res.send(`Message ID: ${req.params.id}`);
});

module.exports = router;
