const express = require("express");
//const { body } = require("express-validator/check");

// MARK: import controller
const ahsProjectController = require("../controllers/ahsproject-controller");
const hsController = require("../controllers/hs-controller");
const projectController = require("../controllers/project-controller");
const rabController = require("../controllers/rab-controller");

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
router.get("/get-rab-judul-full-data", rabController.getRABJudulFullData);

router.post("/post-new-rab-judul", rabController.postNewRABJudul);

router.post("/post-new-rab-detail", rabController.postNewRABDetail);

router.post("/post-new-rab-judul-detail", rabController.postNewRABJudulDetail);

// ========================================= MARK: RABP Controller =========================================
router.get(
    "/get-rab-project-bagian-full-data",
    projectController.getRABProjectBagianFullData
);

router.post(
    "/post-new-rab-project-bagian",
    projectController.postNewRABProjectBagian
);

// ========================================= MARK: Project Controller =========================================
router.get("/get-project-full-data", projectController.getProjectFullData);

router.post("/post-new-project", projectController.postNewProject);

router.post("/delete-project", projectController.deleteProject);

router.post("/update-project", projectController.updateProject);

// ========================================= MARK: Export =========================================
module.exports = router;
