const ServiceCenter = require("../models/ServiceCenter");
const DutyShift = require("../models/DutyShift");

const createSC = async (req, res) => {
  const userid = req.user.id;
  try {
    const { name, description, location } = req.body;

    // Create a new ServiceCenter document
    const newServiceCenter = new ServiceCenter({
      name,
      description,
      location,
      users: [userid], // Must be an array of ObjectIds
    });

    // Save to MongoDB
    await newServiceCenter.save();
    res.status(201).json(newServiceCenter);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



const createPlanning = async (req, res) => {
  try {
    const { serviceCenterId, startDate, repeatWeeks = 1 } = req.body; // Repeat for 12 weeks by default
    if (!serviceCenterId || !startDate) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const serviceCenter = await ServiceCenter.findById(serviceCenterId).populate("users");
    if (!serviceCenter) {
      return res.status(404).json({ message: "Service Center not found." });
    }

    const users = serviceCenter.users;
    if (!users.length) {
      return res.status(400).json({ message: "No users found in the service center." });
    }

    let shifts = [];
    let currentStartDate = new Date(startDate);
    currentStartDate.setHours(currentStartDate.getHours() - 1); // Add 1 hour for timezone offset

    for (let cycle = 0; cycle < repeatWeeks; cycle++) { // Repeat for given weeks
      for (let i = 0; i < users.length; i++) {
        let currentEndDate = new Date(currentStartDate);
        currentEndDate.setDate(currentEndDate.getDate() + 7); // Add 7 days

        const shift = new DutyShift({
          title: `Shift for ${users[i].firstName} ${users[i].lastName} (Week ${i})`,
          userId: users[i]._id,
          serviceCenter: serviceCenterId, // Assuming serviceCenterId as zoneId
          startTime: new Date(currentStartDate),
          endTime: new Date(currentEndDate),
          totalTime: 7 * 24 // Total hours in a week
        });
        shifts.push(shift);

        currentStartDate = new Date(currentEndDate); // Move to the next week
      }
    }

    const savedShifts = await DutyShift.insertMany(shifts);

    serviceCenter.planning.push(...savedShifts.map(shift => shift._id));
    await serviceCenter.save();

    res.status(201).json({ message: "Planning created successfully", shifts: savedShifts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



module.exports = {
  createSC,
  createPlanning,
};
