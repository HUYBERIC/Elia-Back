const Duty= require("../models/DutyShift");


const getDuties = async (req, res) => {
    try{
        const duty = await Duty.find();
     
        res.status(200).json(duty);
    } catch (error) {
        res.status(500).send("Erreur lors de la récupération des gardes");
    }
  };
  
  const addDuty = async (req, res) => {
    try{
      const duty=  new Duty(req.body);
     await duty.save();
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