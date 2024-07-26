const Layout = require("../models/Layout");
const xlsx = require("xlsx");
const fs = require("fs");
const { error } = require("console");
const Equipement = require("../models/Equipment");

exports.importLayout = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No File Uploaded!" });
    }

    const filePath = file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    for (const row of data) {
      const project = row.Projet || "";
      const family = row.Famille || "";
      const post = row.Poste || "";
      const equipement = [];

      // Collect all non-project/family/post columns as equipment
      for (const [key, value] of Object.entries(row)) {
        if (key !== "Projet" && key !== "Famille" && key !== "Poste" && value) {
          const ExistEquip = await Equipement.findOne({ Name: value });
          if(!ExistEquip){
            return res.status(404).json(`Equipement "${value}" do not exist in Equipements List!`)
          }
          equipement.push(value);
        }
      }

      if (equipement.length > 0) {
        const existingLayout = await Layout.findOne({
          $and: [{ project: project }, { family: family }, { post: post }],
        });

        if (existingLayout) {
          existingLayout.Equipement = equipement;
          await existingLayout.save();
        } else {
          const layoutData = new Layout({
            project,
            family,
            post,
            Equipement: equipement,
          });
          await layoutData.save();
        }
      }
    }
    //for removing files
    fs.unlinkSync(filePath);
    const layout = await Layout.find({});
    res.status(200).json(layout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLayouts = async (req, res) => {
  try {
    const data = await Layout.find({});
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.Update = async (req, res) => {
  const { project, family, post, Equipement } = req.body;

  try {
    const existLayout = await Layout.findOne({ project, family, post });
    if (Equipement === "") {
      return res.status(400).json({ message: "There is no Equipement !" });
    }
    if (!existLayout) {
      return res
        .status(400)
        .json({ message: "project or family or post doesnt exist" });
    }
    existLayout.Equipement.push(Equipement);
    await existLayout.save();
    res.status(200).json({ message: "Equipement added successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
