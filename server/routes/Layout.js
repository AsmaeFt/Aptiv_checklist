const express = require("express");
const router = express.Router();
const Layout = require("../controller/Layout");

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

router.post("/ImportExcel", upload.single("excelFile"), Layout.importLayout);
router.get("/Getlayout",Layout.getLayouts)

module.exports = router;
