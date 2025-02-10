const express = require("express");
const router = express.Router();

router.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = router;