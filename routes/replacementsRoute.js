const express = require("express");
const router = express.Router();
const { getReplacements } = require("../controllers/replacementController");
const verifyToken = require("../middleware/authJWT");

router.get("/", getReplacements);

module.exports = router;
