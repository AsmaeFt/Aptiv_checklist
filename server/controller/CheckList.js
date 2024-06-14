const CheckList = require("../models/CheckList");
const Equipment = require("../models/Equipment");
const listEquip = require("../models/Equipment");
const User = require("../models/Users");
const { getExactdate } = require("../functions/utilis");

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

    const query = {
      OperatorID: NewCheckList.OperatorID,
      shift: NewCheckList.shift,
      date: NewCheckList.date,
      equipmentID: FindEquipment._id,
    };

    console.log(query);

    const alreadyExist = await CheckList.findOne(query);
    if (alreadyExist) {
      console.log("Checklist already exists");
      return res.status(400).json({ message: "Checklist already exists" });
    }

    await NewCheckList.save();
    return res
      .status(201)
      .json({ message: "A point should be checked", NewCheckList });
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
};

exports.GetProblems = async (req, res) => {
  try {
    const status = "NOK";
    const FindProblems = await CheckList.find({
      points: { $elemMatch: { status: status } },
    });

    const nokPoints = await Promise.all(
      FindProblems.map(async (doc) => {
        const docNokPoints = doc.points.filter(
          (point) => point.status === "NOK"
        );
        const existEquip = await listEquip.findOne({ _id: doc.equipmentID });

        return docNokPoints.map((point) => ({
          _id: point._id,
          project: doc.project,
          family: doc.family,
          post: doc.post,
          flag: doc.flag,
          Num: point.Num,
          Description: point.Description,
          status: point.status,
          Id_Checklist: doc._id,
          Id_Operator: doc.OperatorID,
          equipmentID: doc.equipmentID,
          nameequipe: existEquip ? existEquip.Name : "Unknown",
          date: doc.date,
          shift: doc.shift,
          project: doc.project,
          family: doc.family,
          ref: doc.ref,
          technicienDecision: doc.technicienDecision,
        }));
      })
    );

    res.status(200).json(nokPoints.flat());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.approveThech = async (req, res) => {
  const {
    Id_CheckList,
    userName,
    Num,
    Action,
    status,
    Date_Action,
    Date_Prevu,
  } = req.body;

  try {
    const existsUser = await User.findOne({ userName });
    if (!existsUser) {
      return res.status(400).json({ error: "User doesn't Exist!" });
    }

    const existChecklist = await CheckList.findOne({_id:Id_CheckList});
    if (!existChecklist) {
      return res.status(400).json({ error: "CheckList doesn't Exist!" });
    }

    const alreadyApproved = existChecklist.technicienDecision.some((decision) =>
      decision.points.some(
        (point) => point.Num === Num && point.status === "Aproved"
      )
    );

    if (alreadyApproved) {
      return res.status(400).json({ error: "Point already approved" });
    }

    const newPoint = {
      Num,
      status,
      Action,
      Date_Action,
      Date_Prevu,
    };

    const technicianDecision = {
      technicienID: existsUser._id,
      points: [newPoint],
    };

    existChecklist.technicienDecision.push(technicianDecision);
    await existChecklist.save();

    res.status(200).json({ message: "Technician decision added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.approveOperator = async (req, res) => {
  try {
    const { Id_CheckList, OperatorID, Num, status } = req.body;

    const existChecklist = await CheckList.findById(Id_CheckList);
    if (!existChecklist) {
      return res.status(400).json({ error: "CheckList doesn't Exist!" });
    }

    const newPoint = {
      Num: Num,
      status: status,
    };

    const OperatorDecision = {
      OperatorID: OperatorID,
      points: [newPoint],
    };

    const point = existChecklist.points.findIndex((p) => p.Num === Num);
    if (point !== -1) {
      existChecklist.points[point].status = "OK";
      existChecklist.OperatornDecision.push(OperatorDecision);
      await existChecklist.save();
      res.status(200).json({ message: "Operator decision added successfully" });
    } else {
      res.status(400).json({ message: "Point doent exist" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
