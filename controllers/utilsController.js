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
    const { serviceCenterId, startDate, repeatWeeks = 1 } = req.body;

    console.log(req.user);
    if(req.user.role != "admin")
    {
      return res.status(400).json({message:"you cannot create a planning as a user"})
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

    for (let cycle = 0; cycle < repeatWeeks; cycle++) { // Répéter sur plusieurs semaines
      for (let i = 0; i < users.length; i++) {
        let currentEndDate = new Date(currentStartDate);
        currentEndDate.setDate(currentEndDate.getDate() + 7); // Shift d'une semaine

        // Créer le shift global
        const shift = new DutyShift({
          title: `Planning - Week ${i + 1}`,
          serviceCenter: serviceCenterId,
          startTime: new Date(currentStartDate),
          endTime: new Date(currentEndDate),
          totalTime: 7 * 24, // Nombre total d'heures dans une semaine
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
        currentStartDate = new Date(currentEndDate); // Passer à la semaine suivante
      }
    }

    // Sauvegarde des shifts créés
    const savedShifts = await DutyShift.insertMany(shifts);

    // Ajouter les shifts au planning du Service Center
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
