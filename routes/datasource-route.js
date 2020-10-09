const express = require("express");
//const { body } = require("express-validator/check");

// MARK: import controller
const ahsSumberController = require("../controllers/ahssumber-controller");
const hsController = require("../controllers/hs-controller");

// MARK: initiation
const router = express.Router();

// ========================================= MARK: HS Sumber Controller =========================================
router.get("/get-hs-full-data", hsController.getHSFullData);

router.get(
    "/get-hs-full-data-group-by-wilayah",
    hsController.getHSFullDataGroupByWilayah
);

router.get(
    "/get-hs-specific-group-by-wilayah",
    hsController.getHSSpecificGroupByWilayah
);

router.post("/post-new-hs", hsController.postNewHS);

// ========================================= MARK: AHS Sumber Controller =========================================
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

router.post(
    "/post-new-ahs-sumber-utama-detail",
    ahsSumberController.postNewAHSSumberUtamaDetail
);

// ========================================= MARK: Export =========================================
module.exports = router;
