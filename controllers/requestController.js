const DutyShift = require("../models/DutyShift");
const Requests = require("../models/Requests");
const Replacement = require("../models/Replacements");

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

    const shiftSegments = shift.segments.find(
      (el) => el.startTime < startUTC && el.endTime > endUTC
    );
    console.log(shiftSegments); // if undefined = the shift is split segments and therefore has 2 users sharing that time

    const shiftId = shiftSegments.userId;

    console.log(shiftId);

    const newRequest = new Requests({
      requesterId: req.user.id,
      receiverId: null,
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

// ✅ Récupérer toutes les requêtes et supprimer celles qui sont dépassées
const getRequests = async (req, res) => {
  try {
    const now = new Date(); // Date actuelle pour comparer avec startTime

    // Supprimer les requêtes "pending" dont la startTime est passée
    await Requests.deleteMany({
      status: "pending", // Si le statut est toujours "pending"
      askedStartTime: { $lt: now }, // Si la startTime est passée (moins que la date actuelle)
    });

    const requests = await Requests.find().populate("requesterId");

    res.json(requests);
  } catch (error) {
    console.log(error);

    res.status(400).json({ error: error.message });
  }
};

// ✅ Récupérer uniquement les requêtes acceptées
const getAcceptStatus = async (req, res) => {
  try {
    const requests = await Requests.find({ status: "approved" }).populate(
      "requesterId receiverId shift"
    );
    res.json(requests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Récupérer uniquement les requêtes en attente
const getPendingRequests = async (req, res) => {
  try {
    const requests = await Requests.find({ status: "pending" }).populate(
      "requesterId"
    );
    res.json(requests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const { id } = req.params; // ID de la requête
    const receiverId = req.user.id; // L'utilisateur qui accepte la requête

    const request = await Requests.findById(id);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Vérifier si l'utilisateur tente de se remplacer lui-même
    if (request.requesterId.toString() === receiverId) {
      await Requests.findByIdAndDelete(id);
      return res.json({
        message: "Replacement request canceled as the user is the same.",
      });
    }
    request.receiverId = receiverId;
    request.status = "approved";
    request.save();
    const shift = await DutyShift.findById(request.shift);
    if (!shift) {
      return res.status(404).json({ error: "Shift not found" });
    }

    const askedStartTime = new Date(request.askedStartTime);
    const askedEndTime = new Date(request.askedEndTime);

    let updatedSegments = [];
    let replacementAdded = false;

    for (let segment of shift.segments) {
      const segmentStart = new Date(segment.startTime);
      const segmentEnd = new Date(segment.endTime);

      if (askedStartTime >= segmentStart && askedEndTime <= segmentEnd) {
        if (askedStartTime > segmentStart) {
          updatedSegments.push({
            userId: segment.userId,
            startTime: segmentStart,
            endTime: askedStartTime,
            totalTime: Math.round((askedStartTime - segmentStart) / 3600000),
          });
        }

        updatedSegments.push({
          userId: receiverId,
          startTime: askedStartTime,
          endTime: askedEndTime,
          totalTime: Math.round((askedEndTime - askedStartTime) / 3600000),
        });

        replacementAdded = true;

        if (askedEndTime < segmentEnd) {
          updatedSegments.push({
            userId: segment.userId,
            startTime: askedEndTime,
            endTime: segmentEnd,
            totalTime: Math.round((segmentEnd - askedEndTime) / 3600000),
          });
        }
      } else {
        updatedSegments.push(segment);
      }
    }

    if (!replacementAdded) {
      return res
        .status(400)
        .json({ error: "Replacement period does not match any shift" });
    }

    shift.segments = updatedSegments;
    await shift.save();
    /* await Requests.findByIdAndDelete(id); */

    res.json({ message: "Request accepted and updated in the shift", shift });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteRequest = async (req, res) => {
  try {
    const paramId = req.params.id;
    await Requests.findByIdAndDelete(paramId);
    res.json({
      message: "succesfully deleted",
    });
  } catch (error) {
    res.json({ message: "something went wrong", error });
  }
};

module.exports = {
  createRequest,
  getRequests,
  getAcceptStatus,
  getPendingRequests,
  acceptRequest,
  deleteRequest
};
