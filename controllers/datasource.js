//const { validationResult } = require ('express-validator/check')
const MaterialAtBuku = require("../models/materialAtBuku");
const MaterialAtSurvey = require("../models/materialAtSurvey");

// MARK: Books =================================================================
exports.getBooksList = (req, res, next) => {
    res.status(201).json({
        message: "Success Get Books List",
    });

    // handle get request, depends on the book choosen
};

exports.getMaterialsFromBook = (req, res, next) => {
    console.log(req.query.namaBukuRef);
    MaterialAtBuku.findAll({ where: { namaBukuRef: req.query.namaBukuRef } })
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
    MaterialAtBuku.create({
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

    // handle post request
    const bukuName = req.body.bukuName;
    const materialName = req.body.materialName;
    const materialUnit = req.body.materialUnit;
    const materialCoef = req.body.materialCoef;

    // submit materials to the table

    // sending response ok or error
};

// MARK: Surveys =================================================================
exports.getSurveysList = (req, res, next) => {
    res.status(201).json({
        message: "Success Get Surveys List",
    });
    // handle get request, depends on the survey choosen
};

exports.getMaterialsFromSurvey = (req, res, next) => {
    res.status(201).json({
        message: "Success Get Materials from Survey",
    });
    //handle get request, depends on the survey choosen
};

exports.postNewMaterialToSurvey = (req, res, next) => {
    res.status(201).json({
        message: "Success Post New Material to Survey",
    });
    // handle post request
    // submit materials to the table
    // sending response ok or error
};
