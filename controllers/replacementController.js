const Replacements = require("../models/Replacements.js");

const getReplacements = async (req, res) => {
  try {
    const requests = await Replacements.find().populate("replacedUserId replacingUserId");
    console.log(requests);
    
    res.json(requests);
  } catch (error) {
    console.log(error);

    res.status(400).json({ error: error.message });
  }
};

module.exports = { getReplacements };