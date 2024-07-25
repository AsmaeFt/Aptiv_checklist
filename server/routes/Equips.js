const express = require("express");
const router = express.Router();
const Equipment = require("../controller/EQUIPS");

const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });


router.get("/GET", Equipment.Get);
router.post("/EDIT", upload.single("pic"), Equipment.EDIT);
router.post("/Delete", upload.single("pic"), Equipment.Delete);
router.post("/ADD", Equipment.ADD);
router.post("/Delete_Point", Equipment.Delete_Point);

module.exports = router;
