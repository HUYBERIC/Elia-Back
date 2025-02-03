const express = require("express");
const router = express.Router();
const { sendMessage, getMessageById } = require("../controllers/messageController");

router.post("/", sendMessage);
router.get("/:id", getMessageById);

module.exports = router;
