const express = require("express");
//const { body } = require("express-validator/check");

// MARK: import controller
const ahsProjectController = require("../controllers/ahsproject-controller");
const hsController = require("../controllers/hs-controller");

// MARK: initiation
const router = express.Router();

// ========================================= MARK: AHS Project Controller =========================================
router.get(
    "/get-ahs-project-full-data",
    ahsProjectController.getAHSProjectFullData
);

router.post(
    "/post-new-ahs-project-utama",
    ahsProjectController.postNewAHSProjectUtama
);

router.post(
    "/post-new-ahs-project-detail",
    ahsProjectController.postNewAHSProjectDetail
);

// ========================================= MARK: RAB Controller =========================================

// ========================================= MARK: Recap Controller =========================================

// ========================================= MARK: Export =========================================
module.exports = router;
