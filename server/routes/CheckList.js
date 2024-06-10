const express = require("express");
const CheckList = require("../controller/CheckList");
const router = express.Router();

router.post("/NewCheckList", CheckList.NewCheckList);
router.get("/GetProblems", CheckList.GetProblems);

module.exports = router;
