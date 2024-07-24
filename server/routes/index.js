const express = require("express");
const router = express.Router();

router.use("/users", require("./userRoutes"));
router.use("/equipe", require("./addequipment"));

router.use("/Equipment", require("./Equipment"));

router.use("/CheckList", require("./CheckList"));

router.use("/Layout", require("./Layout"));
router.use("/Equips", require("./Equips"));


module.exports = router;
