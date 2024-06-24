const Equipenet = require("../models/Equipment");
const listEquip = require("../models/ListEquip");
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

exports.getall = async (req, res) => {
  const { Name } = req.query;
  try {
    const data = await Equipenet.findOne({ Name });
    return res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.UpdateEquip = async (req, res) => {
  const { Name, num, Description } = req.body;
  try {
    const existEquip = await listEquip.findOne({ Name });
    if (!existEquip) {
      return res.status(404).json({ message: "Equipement doesnt exist !" });
    }
    const point = existEquip.Points.find((p) => p.Num === num);
    if (!point) {
      return res.status(404).json({ message: "Point not found!" });
    }

    point.Description = Description;
    await existEquip.save();
    res.status(200).json({ message: "Point updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
