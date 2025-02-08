const express = require("express");
const router = express.Router();
const { createRequest, getRequests, getAcceptStatus,acceptRequest, getPendingRequests } = require("../controllers/requestController");
const verifyToken = require("../middleware/authJWT");

router.post("/", verifyToken, createRequest);

// Route pour récupérer toutes les requêtes
router.get("/", getRequests);

// Route pour récupérer les requêtes acceptées
router.get("/accepted", getAcceptStatus);

// Route pour récupérer les requêtes en attente
router.get("/pending", getPendingRequests);

router.put("/accept/:id", verifyToken, acceptRequest)

module.exports = router;
