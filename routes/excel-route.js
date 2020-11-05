const express = require("express");
//const { body } = require("express-validator/check");

// MARK: import controller
const excelController = require("../controllers/excel-generator-controller");

// MARK: initiation
const router = express.Router();

router.get("/generate-excel", excelController.generateExcel);

module.exports = router;
