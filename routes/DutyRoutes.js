const express = require("express");
const router = express.Router();
const {
  getDuties,
  addDuty,
  updateDuty,
  deleteDuty,
} = require("../controllers/DutyController");

// Récupérer le planning des gardes
router.get("/", getDuties);

// Ajouter une nouvelle garde
router.post("/", addDuty);

// Modifier une garde existante
router.put("/:id", updateDuty);

// Supprimer une garde existante
router.delete("/:id", deleteDuty);

module.exports = router;