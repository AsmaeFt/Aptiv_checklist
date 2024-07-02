const listEquip = require("../models/ListEquip");
const Equipements = require("../models/Equipment");
const xlsx = require("xlsx");



exports.Importexcel = async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetNames = workbook.SheetNames;
    for (const shn of sheetNames) {
      const worksheet = workbook.Sheets[shn];
      const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
      if (data && data.length > 0) {
        const headers = data[0];
        const numIndex = headers.indexOf("Num");
        const descIndex = headers.indexOf("Description");
        if (numIndex === -1 || descIndex === -1) {
          console.log(`Invalid headers in sheet: ${shn}`);
          continue;
        }
        const points = data.slice(1).map((row) => ({
          Num: parseInt(row[numIndex], 10),
          Description: row[descIndex].toString(),
        }));
        const newEquip = new Equipements({
          Name: shn,
          Points: points,
        });
        await newEquip.save();
      } else {
        console.log(`No data found in sheet: ${shn}`);
      }
    }
    const getdata = await Equipements.find({});
    res.status(200).json(getdata);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.GetEquip = async (req, res, next) => {
  try {
    const data = await listEquip.find({});
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

exports.Addequip = async (req, res) => {
  const { Name, Points } = req.body;
  try {
    const existEquip = await listEquip.findOne({ Name });
    if (existEquip) {
      return res.status(400).json({ error: "Equip already exists" });
    }
    const new_Equip = new listEquip({
      Name,
      Points,
    });
    await new_Equip.save();
    res.status(201).json(new_Equip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
