const express = require("express");
const router = express.Router();
const equi = require("../controller/ImportExcels");

router.post("/addequip", equi.Addequip);
router.get("/Getequip", equi.GetEquip);

module.exports = router;