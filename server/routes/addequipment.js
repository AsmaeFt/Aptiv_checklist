const express = require("express");
const router = express.Router();
const equi = require("../controller/ImportExcels");

const multer = require("multer");
const path = require("path");

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post("/addequip", equi.Addequip);
router.get("/Getequip", equi.GetEquip);
router.post("/ImportExcel", upload.single("excelFile"), equi.Importexcel);

module.exports = router;
