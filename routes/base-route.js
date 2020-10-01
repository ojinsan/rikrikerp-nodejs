const express = require("express");
//const { body } = require("express-validator/check");

// MARK: import controller
const baseController = require("../controllers/base-controller");

// MARK: initiation
const router = express.Router();

// ========================================= MARK: Controller =========================================
// MARK: Wilayah Controller
router.post("/post-new-wilayah", baseController.postNewWilayah);

module.exports = router;
