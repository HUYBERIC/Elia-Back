const DutyShift = require("../models/DutyShift");
const Requests = require("../models/Requests"); // Assure-toi que le nom du modèle est correct
const Replacement = require("../models/Replacements"); // Assure-toi que le nom du modèle est correct
const Replacements = require("../models/Replacements");

// ✅ Créer une nouvelle requête
const createRequest = async (req, res) => {
  try {
    const { emergencyLevel, startDate, endDate } = req.body;
    console.log(req.body);

    const startTime = new Date(startDate);
    const endTime = new Date(endDate);

    // Ensure the format is consistent
    const startUTC = new Date(startTime.toISOString());
    const endUTC = new Date(endTime.toISOString());

    console.log("Recherche de shift avec : ", {
      startTime: { $lte: startUTC },
      endTime: { $gte: endUTC },
    });

    const shift = await DutyShift.findOne({
      startTime: { $lte: startUTC },
      endTime: { $gte: endUTC },
    });

    if (!shift) {
      console.log("no shift found");

      return res.status(404).json({ error: "No matching shift found" });
    }

    console.log(shift);

    const newRequest = new Requests({
      requesterId: req.user.id,
      shift: shift,
      status: "pending",
      emergencyLevel,
      askedStartTime: startTime,
      askedEndTime: endTime,
      createdAt: new Date(Date.now() + 3600000),
      updatedAt: new Date(Date.now() + 3600000),
    });

    await newRequest.save();

    res.json(newRequest);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

// ✅ Récupérer toutes les requêtes
const getRequests = async (req, res) => {
  try {
    const requests = await Requests.find().populate("requesterId"); // Correction : Utilisation de `Requests` au lieu de `Request`

    res.json(requests);
  } catch (error) {
    console.log(error);

    res.status(400).json({ error: error.message });
  }
};

// ✅ Récupérer uniquement les requêtes acceptées
const getAcceptStatus = async (req, res) => {
  try {
    const requests = await Requests.find({ status: "accepted" });
    res.json(requests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Récupérer uniquement les requêtes en attente
const getPendingRequests = async (req, res) => {
  try {
    const requests = await Requests.find({ status: "pending" });
    res.json(requests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const { id } = req.params; // Récupération de l'ID de la requête via les paramètres
    const receiverId = req.user.id; // L'utilisateur qui accepte la requête
    console.log("Request canceled: User tried to replace themselves.");
    const request = await Requests.findById(id);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Vérifier si l'utilisateur tente de se remplacer lui-même
    if (request.requesterId.toString() === receiverId) {
      // Annuler la demande de remplacement
      await Requests.findByIdAndDelete(id);
      console.log("Request canceled: User tried to replace themselves.");
      return res.json({ message: "Replacement request canceled as the user is the same." });
    }

    request.status = "approved";
    request.receiverId = receiverId;
    await request.save();

    // Trouver le shift correspondant
    const shift = await DutyShift.findById(request.shift);
    if (!shift) {
      
      return res.status(404).json({ error: "Shift not found" });
    }

    if (!shift.replacements) shift.replacements = [];

    // Créer un nouvel enregistrement de remplacement
    const newReplacement = new Replacement({
      replacedUserId: request.requesterId,
      replacingUserId: receiverId,
      serviceCenter: shift.ServiceCenter,
      startTime: request.askedStartTime,
      endTime: request.askedEndTime,
      status: request.status,
    });

    await newReplacement.save();

    shift.replacements.push(newReplacement);

    console.log(shift);

    shift.replacements.push(newReplacement);
    await shift.save();

    // Supprimer la requête acceptée pour ne plus l'afficher dans la liste
    await Requests.findByIdAndDelete(id);

    res.json({ message: "Request accepted and moved to calendar", shift });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createRequest,
  getRequests,
  getAcceptStatus,
  getPendingRequests,
  acceptRequest,
};