const express = require("express");
const router = express.Router();
const {
  getDuties,
  addDuty,
  updateDuty,
  deleteDuty,
} = require("../controllers/DutyController");

//GET REQUESTS
router.get("/", getDuties);

//POST REQUESTS
router.post("/", addDuty);

//PUT REQUESTS
router.put("/:id", updateDuty);

//DELETE REQUESTS
router.delete("/:id", deleteDuty);

module.exports = router;