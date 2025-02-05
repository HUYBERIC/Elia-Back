const express = require("express");
const router = express.Router();
const {
  getDuties,
  addDuty,
  updateDuty,
  deleteDuty,
} = require("../controllers/DutyController");


router.get("/", getDuties);


router.post("/", addDuty);


router.put("/:id", updateDuty);


router.delete("/:id", deleteDuty);

module.exports = router;