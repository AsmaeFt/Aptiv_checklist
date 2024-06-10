const Equipenet = require("../models/Equipment");

exports.AddEquipenet = async (req, res) => {
  try {
    const { name, ref, Points } = req.body;
    const newEquipenet = new Equipenet({
      Name: name,
      ref: ref,
      Pic: req.file ? req.file.path : null,
      Points: JSON.parse(Points),
    });

    await newEquipenet.save();
    res.status(201).json(newEquipenet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.Get_Equipent = async (req, res) => {
  try {
    const { name } = req.query;
    const FindOne = await Equipenet.findOne({ Name: name });
    if (!FindOne) {
      return res.status(404).json("Equipement Does not Exist!");
    }
    return res.status(201).json(FindOne);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* exports.Get_Equipent = async (req, res) => {
  try {
   
    const FindOne = await Equipenet.find({ });
    if (FindOne) {
      res.status(201).json(FindOne);
    } else {
      res.status(404).json("Equipement Does not Exist!");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 */
