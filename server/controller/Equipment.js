const Equipenet = require("../models/Equipment");
const Layout = require("../models/Layout");

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

exports.Getequipment = async (req, res) => {
  const { project, family, post } = req.body;

  try {
    const layout = await Layout.findOne({ project, family, post });
    if (!layout) {
      return res
        .status(404)
        .json({ message: "post or family or project doesnt exist !" });
    }

    const equipmentNames = layout.Equipement;
    const listEquipements = await Equipenet.find({
      Name: { $in: equipmentNames },
    });
    if (listEquipements.length === 0) {
      return res.status(404).json({ message: "no matched Equipemnts" });
    }
    return res.status(200).json(listEquipements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
