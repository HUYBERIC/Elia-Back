const Duty = require("../models/DutyShift");

const getDuties = async (req, res) => {
  try {
    const duties = await Duty.find();

    // Convert the date format to be compatible with FullCalendar
    res.status(200).json(
      duties.map((duty) => ({
        id: duty._id,
        title: duty.title || "Sans titre",
        start: duty.startTime, // ✅ Correction ici
        end: duty.endTime, // ✅ Correction ici
      }))
    );
  } catch (error) {
    res.status(500).send("Erreur lors de la récupération des gardes");
  }
};

const addDuty = async (req, res) => {
  try {
    const { title, startTime, endTime } = req.body;
    const duty = new Duty({ title, startTime, endTime });
    await duty.save();

    res.status(200).json(duty);
  } catch (error) {
    res.status(500).send("Erreur lors de l'ajout de la garde");
  }
};

const updateDuty = async (req, res) => {
  try {
    const duty = await Duty.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(duty);
  } catch (error) {
    res.status(500).send("Erreur lors de la modification de la garde");
  }}
  
  const deleteDuty = async (req, res) => {
    try {
        const duty = await Duty.findByIdAndDelete(req.params.id);

        if (!duty) {
            return res.status(404).json({ message: "Garde non trouvée" });
        }

        res.json({ message: `Suppression réussie`, duty });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de la garde", error });
    }
};
  
  module.exports = { getDuties, addDuty, updateDuty, deleteDuty };
