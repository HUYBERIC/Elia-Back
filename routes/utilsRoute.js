const verifyToken = require("../middleware/authJWT");
const express = require("express");
const router = express.Router();
const {
  createSC,
  createPlanning
} = require("../controllers/utilsController");

router.post("/createSC",verifyToken, createSC);
router.post("/create-planning", createPlanning);

module.exports = router;