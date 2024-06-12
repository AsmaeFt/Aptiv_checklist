const express = require("express");
const CheckList = require("../controller/CheckList");
const router = express.Router();

router.post("/NewCheckList", CheckList.NewCheckList);
router.get("/GetProblems", CheckList.GetProblems);

//Aprove by tech
router.post("/Aprove_tech", CheckList.approveThech);
router.post("/Aprove_Oper", CheckList.approveOperator);
module.exports = router;
