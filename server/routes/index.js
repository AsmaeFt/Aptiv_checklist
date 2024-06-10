const express = require("express");
const router = express.Router();

router.use("/users", require("./userRoutes"));
router.use("/equipe", require("./addequipment"));

router.use("/Equipment", require("./Equipment"));

module.exports = router;
