const express = require("express");
//const { body } = require("express-validator/check");

// MARK: import controller
const ahsSumberController = require("../controllers/ahssumber-controller");
const hsController = require("../controllers/hs-controller");

// MARK: initiation
const router = express.Router();

// ========================================= MARK: AHS Sumber Controller =========================================
router.get("/get-hs-full-data", hsController.getHSFullData);

router.get(
    "/get-hs-full-data-group-by-wilayah",
    hsController.getHSFullDataGroupByWilayah
);

router.post("/post-new-hs", hsController.postNewHS);

// ========================================= MARK: HS Controller =========================================
router.get(
    "/get-ahs-sumber-full-data",
    ahsSumberController.getAHSSumberFullData
);

router.post(
    "/post-new-ahs-sumber-utama",
    ahsSumberController.postNewAHSSumberUtama
);

router.post(
    "/post-new-ahs-sumber-detail",
    ahsSumberController.postNewAHSSumberDetail
);

// ========================================= MARK: Export =========================================
module.exports = router;
