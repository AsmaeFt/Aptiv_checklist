const express = require("express");
const CheckList = require("../controller/CheckList");
const router = express.Router();

router.get("/Getall", CheckList.GetAll);

router.post("/NewCheckList", CheckList.NewCheckList);
router.get("/GetProblems", CheckList.GetProblems);
router.post("/GetChecklist", CheckList.GetCheckList);

//Aprove by tech
router.post("/Aprove_tech", CheckList.approveThech);
router.post("/Aprove_Oper", CheckList.approveOperator);

router.post("/Aprove_T", CheckList.Thechnician);

module.exports = router;
