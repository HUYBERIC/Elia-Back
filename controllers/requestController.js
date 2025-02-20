const DutyShift = require("../models/DutyShift");
const Requests = require("../models/Requests");
const Replacement = require("../models/Replacements");

const createRequest = async (req, res) => {
  try {
    const { emergencyLevel, startDate, endDate } = req.body;

    const startTime = new Date(startDate);
    const endTime = new Date(endDate);

    const startUTC = new Date(startTime.toISOString());
    const endUTC = new Date(endTime.toISOString());

    console.log("Looking for shifts with : ", {
      startTime: { $lte: startUTC },
      endTime: { $gte: endUTC },
    });

    const shift = await DutyShift.findOne({
      startTime: { $lte: startUTC },
      endTime: { $gte: endUTC },
    });

    if (!shift) {
      console.log("No shift found");
      return res.status(404).json({ error: "No matching shift found" });
    }

    const shiftSegments = shift.segments.find(
      (el) => el.startTime < startUTC && el.endTime > endUTC
    );

    if (!shiftSegments || shiftSegments.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message:
          "You're requesting a shift outside of your own duty hours.",
      });
    }

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

const getRequests = async (req, res) => {
  try {
    const now = new Date();
    
    await Requests.deleteMany({
      status: "pending",
      askedStartTime: { $lt: now },
    });

    const requests = await Requests.find().populate("requesterId");

    res.json(requests);
  } catch (error) {
    console.log(error);

    res.status(400).json({ error: error.message });
  }
};

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

const getPendingRequests = async (req, res) => {
  try {
    const now = new Date();
    console.log("Current Date and Time: ", now);
    
    const result = await Requests.deleteMany({
      status: "pending",
      askedStartTime: { $lt: new Date(now - 24 * 60 * 60 * 1000) },
    });
    console.log("Delete result: ", result);
    
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
    const { id } = req.params;
    const receiverId = req.user.id;

    const request = await Requests.findById(id);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    
    if (request.requesterId.toString() === receiverId) {
      await Requests.findByIdAndDelete(id);
      return res.json({
        message: "Replacement request canceled by requesting user.",
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
    
    if (
      askedStartTime.getHours() === 0 &&
      askedStartTime.getMinutes() === 0 &&
      askedStartTime.getSeconds() === 0
    ) {
      askedStartTime.setHours(0, 0, 0, 0);
    }

    if (
      askedEndTime.getHours() === 0 &&
      askedEndTime.getMinutes() === 0 &&
      askedEndTime.getSeconds() === 0
    ) {
      askedEndTime.setHours(0, 0, 0, 0);
    }

    let updatedSegments = [];
    let replacementAdded = false;

    for (let segment of shift.segments) {
      const segmentStart = new Date(segment.startTime);
      const segmentEnd = new Date(segment.endTime);

      if (askedStartTime >= segmentStart && askedEndTime <= segmentEnd) {
        if (askedStartTime.getTime() > segmentStart.getTime()) {
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

        if (askedEndTime.getTime() < segmentEnd.getTime()) {
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
        .json({ error: "Replacement period does not match any existing shift." });
    }

    shift.segments = updatedSegments;
    await shift.save();
    /* await Requests.findByIdAndDelete(id); */

    res.json({ message: "Request accepted and updated within the shift", shift });
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
      message: "Request succesfully deleted.",
    });
  } catch (error) {
    res.json({ message: "Error while deleting request.", error });
  }
};

module.exports = {
  createRequest,
  getRequests,
  getAcceptStatus,
  getPendingRequests,
  acceptRequest,
  deleteRequest,
};
