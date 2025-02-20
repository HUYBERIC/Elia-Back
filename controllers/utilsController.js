const ServiceCenter = require("../models/ServiceCenter");
const DutyShift = require("../models/DutyShift");

const createSC = async (req, res) => {
  const userid = req.user.id;
  try {
    const { name, description, location } = req.body;
    
    const newServiceCenter = new ServiceCenter({
      name,
      description,
      location,
      users: [userid],
    });
    
    await newServiceCenter.save();
    res.status(201).json(newServiceCenter);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createPlanning = async (req, res) => {
  try {
    const { serviceCenterId, startDate, repeatWeeks = 1 } = req.body;

    console.log(req.user);
    if(req.user.role != "admin")
    {
      return res.status(400).json({message:"You cannot create a planning as a user"})
    }

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

    for (let cycle = 0; cycle < repeatWeeks; cycle++) {
      for (let i = 0; i < users.length; i++) {
        let currentEndDate = new Date(currentStartDate);
        currentEndDate.setDate(currentEndDate.getDate() + 7);
       
        const shift = new DutyShift({
          title: `Planning - Week ${i + 1}`,
          serviceCenter: serviceCenterId,
          startTime: new Date(currentStartDate),
          endTime: new Date(currentEndDate),
          totalTime: 7 * 24,
          mainUserId: users[i]._id,
          segments: [
            {
              userId: users[i]._id,
              startTime: new Date(currentStartDate),
              endTime: new Date(currentEndDate),
              totalTime: 7 * 24,
            },
          ],
        });

        shifts.push(shift);
        currentStartDate = new Date(currentEndDate);
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
