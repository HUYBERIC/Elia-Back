const express = require("express");
const router = express.Router();
const { createRequest, getRequests, getAcceptStatus,acceptRequest, getPendingRequests,deleteRequest } = require("../controllers/requestController");
const verifyToken = require("../middleware/authJWT");

//POST REQUESTS
router.post("/", verifyToken, createRequest);

//GET REQUESTS
router.get("/", getRequests);
router.get("/accepted", getAcceptStatus);
router.get("/pending", getPendingRequests);

//PUT REQUESTS
router.put("/accept/:id", verifyToken, acceptRequest)

//DELETE REQUESTS
router.delete("/:id",deleteRequest)

module.exports = router;
