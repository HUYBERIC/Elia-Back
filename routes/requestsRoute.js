const express = require("express");
const router = express.Router();
const { createRequest, getRequests, getAcceptStatus,acceptRequest, getPendingRequests } = require("../controllers/requestController");
const verifyToken = require("../middleware/authJWT");

router.post("/", verifyToken, createRequest);

router.get("/", getRequests);
router.get("/accepted", getAcceptStatus);
router.get("/pending", getPendingRequests);

router.put("/accept/:id", verifyToken, acceptRequest)

module.exports = router;
