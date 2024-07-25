const Equipment = require("../models/Equipment");

//// Get All Equips
exports.Get = async (req, res) => {
  try {
    const data = await Equipment.find();
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//// Get All Equips

//// ADD
exports.ADD = async (req, res) => {
  try {
    const { Name, ref, Points } = req.body;
    const exist = await Equipment.findOne({ Name });

    if (exist) {
      exist.ref = ref;
      Points.map((p) => {
        const existp = exist.Points.find((m) => m.Num === p.Num);
        if (existp) {
          existp.Position = p.Position;
        }
      });
      exist.updatedAt = new Date();
      await exist.save();
      const data = await Equipment.find({});
      res.status(200).json(data);
    } else {
      return res.status(404).json({ message: "Equipement Not Found!" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//// ADD

//// EDIT
exports.EDIT = async (req, res) => {
  const { Name, field, value } = req.body;
  try {
    const findEquip = await Equipment.findOne({ Name });
    if (!findEquip) {
      return res.status(404).json("Equipment not found");
    }

    switch (field) {
      case "Name":
        console.log(true);
        findEquip.Name = value;
        break;
      case "ref":
        findEquip.ref = value;
        break;
      case "pic":
        findEquip.Pic = req.file ? req.file.path : findEquip.Pic;
        break;
    }
    findEquip.updatedAt = new Date();
    await findEquip.save();
    const data = await Equipment.find({});
    return res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//// EDIT

//// DELETE
exports.Delete = async (req, res) => {
  const { Name } = req.body;
  try {
    await Equipment.deleteOne({ Name });
    const data = await Equipment.find({});
    res.status(200).json(data);
  } catch (err) {
    console.error("Error deleting equipment:", err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the equipment" });
  }
};
//// DELETE

//// DELETE POINT
exports.Delete_Point = async (req, res) => {
  const { Name, Num } = req.body;
  try {
    const findEquip = await Equipment.findOne({ Name });
    if (findEquip) {
      const point = findEquip.Points.find((p) => p.Num === Num);
      if (point) {
        delete point.Position;
        await findEquip.save();
        return res.status(200).json("Position deleted successfully!");
      }
      return res.status(404).json({ error: "Point not found." });
    }
    return res.status(404).json({ error: "Equipment not found." });
  } catch (err) {
    console.error("Error deleting point:", err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the point" });
  }
};
//// DELETE POINT
