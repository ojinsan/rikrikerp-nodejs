//const { validationResult } = require ('express-validator/check')
const MaterialAtBukuZ = require("../models/materialAtBuku");
const MaterialAtSurvey = require("../models/materialAtSurvey");
const Project = require("../models/Project");

// MARK: Books =================================================================
exports.getBooksList = (req, res, next) => {
    res.status(201).json({
        message: "Success Get Books List",
    });

    // handle get request, depends on the book choosen
};

exports.getMaterialsFromBook = (req, res, next) => {
    console.log(req.query.namaBukuRef);
    MaterialAtBukuZ["tahune-2"]
        .findAll({ where: { namaBukuRef: req.query.namaBukuRef } })
        .then((materials) => {
            res.status(201).json({
                message: "Success Get Materials from Book",
                materials: materials,
            });
        })
        .catch((err) => {
            res.status(500);
            console.log(err);
        });

    // handle get request, depends on the book choosen
};

exports.postNewMaterialToBook = (req, res, next) => {
    console.log("postNewMaterialToBook");
    MaterialAtBukuZ["tahune-2"]
        .create({
            //idBukuRef: 123,
            namaBukuRef: req.body.namaBukuRef,
            namaMaterial: req.body.namaMaterial,
            satuan: req.body.satuan,
            koefisien: req.body.koefisien,
        })
        .then((material) => {
            res.status(201).json({
                message: "Success Post New Material to Book",
                material: material,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

// MARK: Surveys =================================================================
exports.getSurveysList = (req, res, next) => {
    res.status(201).json({
        message: "Success Get Surveys List",
    });
    // handle get request, depends on the survey choosen
};

exports.getMaterialsFromSurvey = (req, res, next) => {
    console.log(req.query.namaSurveyRef);
    MaterialAtSurvey.findAll({
        where: { namaSurveyRef: req.query.namaSurveyRef },
    })
        .then((materials) => {
            res.status(201).json({
                message: "Success Get Materials from Survey",
                materials: materials,
            });
        })
        .catch((err) => {
            console.log(err);
        });

    //handle get request, depends on the survey choosen
};

exports.postNewMaterialToSurvey = (req, res, next) => {
    MaterialAtSurvey.create({
        namaSurveyRef: req.body.namaSurveyRef,
        // idMaterial: req.body.idMaterial,
        namaMaterial: req.body.namaMaterial,
        harga: req.body.harga,
    })
        .then((material) => {
            res.status(201).json({
                message: "Success Post New Material to Survey",
                material: material,
            });
        })
        .catch((err) => {
            console.log(err);
        });

    // handle post request
    // submit materials to the table
    // sending response ok or error
};
