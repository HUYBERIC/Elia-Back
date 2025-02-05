const Duty= require("../models/DutyShift");


const getDuties = async (req, res) => {
    try{
        const duties = await Duty.find();
     
        // Convert the date format to be compatible with FullCalendar
        res.status(200).json(duties.map(duty => ({
          id: duty._id,
          title: duty.title || "Sans titre",
          start: duty.startTime, // ✅ Correction ici
          end: duty.endTime // ✅ Correction ici
      })));    } catch (error) {
        res.status(500).send("Erreur lors de la récupération des gardes");
    }
  };
  
  const addDuty = async (req, res) => {
    try{
      console.log(req.body);

      const { title, startTime, endTime } = req.body;
      const duty = new Duty({ title, startTime, endTime });
     await duty.save();
     console.log(duty);
     
    res.status(200).json(duty);
    } catch (error) {
      res.status(500).send("Erreur lors de l'ajout de la garde");
  
  }
 
  };
  
  const updateDuty = async(req, res) => {
    try{ 
      const duty =await Duty.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(duty);
  } catch (error) {
    res.status(500).send("Erreur lors de la modification de la garde");
  }}
  
  const deleteDuty =async (req, res) => {
    try {
      await Duty.findByIdAndDelete(req.params.id);
      res.send(`Suppression de la garde avec l'ID: ${req.params.id}`);
      res.json(duty);
    } catch (error) {
      res.status(500).send("Erreur lors de la suppression de la garde");
      
    }
   
  };
  
  module.exports = { getDuties, addDuty, updateDuty, deleteDuty };