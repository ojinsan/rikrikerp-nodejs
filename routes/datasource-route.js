const express = require("express");
//const { body } = require("express-validator/check");

// MARK: import controller
const datasourceController = require("../controllers/datasource");

// MARK: initiation
const router = express.Router();

router.get("/get-books-list", datasourceController.getBooksList);

router.get("/get-surveys-list", datasourceController.getSurveysList);

router.get(
    "/get-materials-from-survey",
    datasourceController.getMaterialsFromSurvey
);

router.get(
    "/get-materials-from-book",
    datasourceController.getMaterialsFromBook
);

router.post(
    "/post-new-material-to-survey",
    datasourceController.postNewMaterialToSurvey
);

router.post(
    "/post-new-material-to-book",
    datasourceController.postNewMaterialToBook
);

//update material mah pas post aja, kalo edit == true AND nama id material exist

module.exports = router;
