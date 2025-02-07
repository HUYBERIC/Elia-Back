const DutyShift = require("../models/DutyShift");
const Requests = require("../models/Requests"); // Assure-toi que le nom du modèle est correct

// ✅ Créer une nouvelle requête
const createRequest = async (req, res) => {
  try {
    const { emergencyLevel, startDate, endDate } = req.body;
    console.log(req.body);

    const startTime = new Date(`${startDate}:00+00:00`);
    const endTime = new Date(`${endDate}:00+00:00`);

    console.log(startTime);
    console.log(endTime);

    const requesterId = req.user.id;
    const shift = await DutyShift.findOne({
      _id: requesterId,
      startTime: { $lte: new Date(startTime) },
      endTime: { $gte: new Date(endTime) },
    });

    const newRequest = new Requests({
      requesterId,
      shiftToReplace: shift,
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
    console.log(requests);

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

module.exports = {
  createRequest,
  getRequests,
  getAcceptStatus,
  getPendingRequests,
};
