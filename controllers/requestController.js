const DutyShift = require("../models/DutyShift");
const Requests = require("../models/Requests");

const createRequest = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    console.log(req.body);

    const startTime = new Date(`${startDate}:00+02:00`);
    const endTime = new Date(`${endDate}:00+02:00`);

    console.log(startTime);
    console.log(endTime);

    const requesterId = req.user.id;
    const shift = await DutyShift.findOne({
      _id: requesterId,
      startTime: { $lte: new Date(startTime) },
      endTime: { $gte: new Date(endTime) },
    });

    const newRequest = await new Requests({
      requesterId,
      shiftToReplace: shift,
      status: "pending",
      askedStartTime: startTime,
      askedEndTime: endTime,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    await newRequest.save();

    res.json(newRequest);
  } catch (error) {
    console.log(error);

    res.json({ error });
  }
};

const getRequests = async (req, res) => {
  try {
    const requests = await Request.find();

    res.json(requests);
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};

module.exports = { createRequest, getRequests };
