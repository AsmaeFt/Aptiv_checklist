const CheckList = require("../models/CheckList");

const Equipment = require("../models/Equipment");

exports.NewCheckList = async (req, res) => {
  const { EquipmentName, points, ...rest } = req.body;
  const FindEquipment = await Equipment.findOne({ Name: EquipmentName });

  if (!FindEquipment) {
    return res.status(400).json({ error: "Invalid Equipment" });
  }

  const NewChecklis = {
    equipmentID: FindEquipment._id,
    points,
    ...rest,
  };
  try {
    const NewCheckList = new CheckList(NewChecklis);
    await NewCheckList.save();
    res
      .status(201)
      .json({ message: "a point should be checked", NewCheckList });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.GetProblems = async (req, res) => {
  try {
    const status = "NOK";
    const FindProblems = await CheckList.find({
      points: { $elemMatch: { status: status } }
    });
     const nokPoints = FindProblems.reduce((acc, doc) => {
      const docNokPoints = doc.points.filter(point => point.status === "NOK");
      return [...acc, ...docNokPoints.map(point => ({
        _id: point._id,
        Num: point.Num,
        Description: point.Description,
        status: point.status,
        equipmentID: doc.equipmentID,
        date: doc.date,
        shift: doc.shift,
        project: doc.project,
        family: doc.family,
        ref: doc.ref
      }))];
    }, []);

    res.status(200).json(nokPoints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};