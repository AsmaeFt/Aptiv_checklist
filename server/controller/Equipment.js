const Equipment = require("../models/Equipment");
const listEquip = require("../models/ListEquip");
const Layout = require("../models/Layout");

////

exports.Get = async (req, res) => {
  try {
    const data = await Equipment.find();
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.AddEquipenet = async (req, res) => {
  try {
    const { Name, ref, Points } = req.body;
    const exist = await Equipment.findOne({ Name });
    const parsedPoints = JSON.parse(Points);

    if (exist) {
      exist.ref = ref;
      exist.Pic = req.file ? req.file.path : exist.Pic;

      parsedPoints.map((p) => {
        const existp = exist.Points.find((m) => m.Num === p.Num);
        if (existp) {
          existp.Description = p.Description;
          existp.Position = p.Position;
        }
      });

      exist.updatedAt = new Date();
      await exist.save();
      res.status(200).json(exist);
    } else {
      return res.status(404).json({ message: "Equipement Not Found!" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

////

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
    const listEquipements = await Equipment.find({
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
    const data = await Equipment.findOne({ Name });
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
    const data = await Equipment.find({});
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.UpdateEquipName = async (req, res) => {
  const { Name, newOne } = req.body;

  try {
    const findEquip = await Equipment.findOne({ Name });

    if (!findEquip) {
      return res.status(404).json({ message: "Equipment Not Found" });
    }
    const e = await listEquip.findOne({ Name });
    e.Name = newOne;
    await e.save();

    findEquip.Name = newOne;
    await findEquip.save();

    const data = await listEquip.find({});
    res.status(200).json({
      message: "Equipment updated successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.Delete = async (req, res) => {
  const { Name } = req.body;
  try {
    await listEquip.deleteOne({ Name });
    res.status(200).json({ message: "Equipment deleted successfully" });
  } catch (err) {
    console.error("Error deleting equipment:", err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the equipment" });
  }
};

exports.GetNames = async (req, res) => {
  try {
    const names = await Equipment.find({}, "Name");
    const name = names.map((e) => e.Name);
    res.status(200).json(name);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
