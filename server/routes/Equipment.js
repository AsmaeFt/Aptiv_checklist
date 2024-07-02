const express = require("express");
const router = express.Router();
const Equipment = require("../controller/Equipment");

const multer = require("multer");
const path = require("path");

// Multer configuration
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
router.post("/AddNew_Equipment", upload.single("pic"), Equipment.AddEquipenet);
router.post("/GetEquipement", Equipment.Getequipment);
router.get("/get", Equipment.getall);

router.post("/Update", Equipment.UpdateEquip);
router.post("/Delete", Equipment.Delete);

router.post("/UpdateEq", Equipment.UpdateEquipName);
router.get("/GetNames", Equipment.GetNames);

module.exports = router;
