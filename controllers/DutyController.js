const Duty = require("../models/DutyShift");

const getDuties = async (req, res) => {
  try {
    const duties = await Duty.find()
      .populate({
        path: "segments.userId",
        model: "User",
        select: "firstName lastName email",
      });

    res.status(200).json(
      duties.map((duty) => ({
        id: duty._id,
        title: duty.title || "Untitled",
        serviceCenter: duty.serviceCenter,
        start: duty.startTime,
        end: duty.endTime,
        totalTime: duty.totalTime,
        mainUserId: duty.mainUserId,
        segments: duty.segments.map((segment) => ({
          id: segment._id,
          user: segment.userId
            ? {
                id: segment.userId._id,
                firstName: segment.userId.firstName,
                lastName: segment.userId.lastName,
                email: segment.userId.email,
              }
            : null,
          startTime: segment.startTime,
          endTime: segment.endTime,
          totalTime: segment.totalTime,
        })),
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Error while getting duties.");
  }
};


const addDuty = async (req, res) => {
  try {
    const { title, startTime, endTime, userId } = req.body;

    const totalTime = Math.round((new Date(endTime) - new Date(startTime)) / 3600000);

    const duty = new Duty({
      title,
      startTime,
      endTime,
      totalTime,
      segments: [
        {
          userId,
          startTime,
          endTime,
          totalTime
        }
      ]
    });

    await duty.save();
    res.status(200).json(duty);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error while adding duty.");
  }
};

const updateDuty = async (req, res) => {
  try {
    const { title, startTime, endTime, segments } = req.body;
    const duty = await Duty.findById(req.params.id);

    if (!duty) {
      return res.status(404).json({ message: "Duty shift not found." });
    }

    if (title) duty.title = title;
    if (startTime) duty.startTime = new Date(startTime);
    if (endTime) duty.endTime = new Date(endTime);

    if (segments && Array.isArray(segments)) {
      duty.segments = segments.map(segment => ({
        userId: segment.userId,
        startTime: new Date(segment.startTime),
        endTime: new Date(segment.endTime),
        totalTime: Math.round((new Date(segment.endTime) - new Date(segment.startTime)) / 3600000)
      }));
    }

    await duty.save();
    res.json(duty);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error while updating duty shift.");
  }
};

const deleteDuty = async (req, res) => {
  try {
    const duty = await Duty.findByIdAndDelete(req.params.id);
    if (!duty) {
      return res.status(404).json({ message: "Duty shift not found." });
    }
    res.json({ message: "Suppression réussie", duty });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting duty.", error });
  }
};


module.exports = { getDuties, addDuty, updateDuty, deleteDuty };
