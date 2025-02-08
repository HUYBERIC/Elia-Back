const DutyShift = require("../models/DutyShift");
const Requests = require("../models/Requests"); // Assure-toi que le nom du modèle est correct
const Replacement = require("../models/Replacements"); // Assure-toi que le nom du modèle est correct

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
    const { requestId } = req.body;
    const receiverId = req.user.id;

    const request = await Requests.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    console.log(requestId);
    console.log(request);
    console.log(receiverId);

    request.status = "approved";
    request.receiverId = receiverId;
    await request.save();

    const shift = await DutyShift.findById(request.shift);
    if (!shift) {
      return res.status(404).json({ error: "Shift not found" });
    }

    if (!shift.replacements) shift.replacements = [];

    const newReplacement = new Replacement({
      replacingUserId: receiverId,
      serviceCenter: shift.ServiceCenter,
      startTime: request.askedStartTime,
      endTime: request.askedEndTime,
      status: request.status,
    })

    await newReplacement.save()

    shift.replacements.push(
      newReplacement
    );

    console.log(shift);

    await shift.save();

    res.json(request);
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
