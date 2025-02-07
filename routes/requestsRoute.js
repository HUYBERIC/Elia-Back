const express = require("express");
const router = express.Router();
const { createRequest, getRequests } = require("../controllers/requestController");
const verifyToken = require("../middleware/authJWT");

router.post("/", verifyToken, createRequest);

router.get("/requests", getRequests)

module.exports = router;
