const express = require("express");
//const { body } = require("express-validator/check");

// MARK: import controller
const baseController = require("../controllers/base-controller");

// MARK: initiation
const router = express.Router();

// ========================================= MARK: Controller =========================================
// MARK: Wilayah Controller
router.post("/post-new-wilayah", baseController.postNewWilayah);

router.get("/get-wilayah-full-data", baseController.getWilayahFullData);

router.get("/get-year", baseController.getYear);

router.post("/update-wilayah", baseController.updateWilayah);

router.post("/delete-wilayah", baseController.deleteWilayah);

module.exports = router;
