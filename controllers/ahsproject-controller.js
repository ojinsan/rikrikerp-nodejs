const AHSProjectUtama = require("../models/AHSProject/AHSProjectUtama");
const AHSProjectDetail = require("../models/AHSProject/AHSProjectDetail");

exports.getAHSProjectSumberName = (req, res, next) => {
    // only retrieve AHS's Project unique value
};

exports.getAHSProjectFullDataBySumber = (req, res, next) => {
    // retrieve all data filtered by one sumber
};

exports.getAHSProjectFullData = (req, res, next) => {
    // retrieve all data from one table
    console.log("get AHS Project FullData");
    const TAHUN = req.query.TAHUN;
    AHSProjectUtama[TAHUN].findAll({
        include: [
            {
                model: AHSProjectDetail[TAHUN],
                required: false,
            },
        ],
    })
        .then((AHSUtama) => {
            var newAHSUtama = [];
            AHSUtama.map((satuAHSUtama) => {
                const satuAHSUtamaTemp = JSON.parse(
                    JSON.stringify(satuAHSUtama)
                );
                const satuAHSUtamaDetailTemp =
                    satuAHSUtamaTemp["AHS_PROJECT_DETAIL_" + TAHUN + "s"];
                delete satuAHSUtamaTemp["AHS_PROJECT_DETAIL_" + TAHUN + "s"];
                satuAHSUtamaTemp["AHS_PROJECT_DETAIL"] = satuAHSUtamaDetailTemp;
                newAHSUtama.push(satuAHSUtamaTemp);
            });
            res.status(201).json({
                message: "Success Get AHS Sumber",
                AHS_PROJECT_UTAMA: newAHSUtama,
            });
        })
        .catch((err) => {
            res.status(500);
            console.log(err);
        });
};

exports.postNewAHSProjectUtama = (req, res, next) => {
    console.log("postNewAHSProjectUtama");
    const TAHUN = req.query.TAHUN;
    const ID_PROJECT = req.body.ID_PROJECT;
    const AHS_UTAMA_ID = req.body.AHS_UTAMA_ID;
    const NAMA_AHS_PROJECT = req.body.NAMA_AHS_PROJECT;
    const NO_URUT = req.body.NO_URUT;
    const KOEFISIEN_AHS = req.body.KOEFISIEN_AHS;
    const PENJELASAN_KOEFISIEN_AHS = req.body.PENJELASAN_KOEFISIEN_AHS;

    AHSProjectUtama[TAHUN].create({
        ID_PROJECT: ID_PROJECT,
        AHS_UTAMA_ID: AHS_UTAMA_ID,
        NAMA_AHS_PROJECT: NAMA_AHS_PROJECT,
        NO_URUT: NO_URUT,
        KOEFISIEN_AHS: KOEFISIEN_AHS,
        PENJELASAN_KOEFISIEN_AHS: PENJELASAN_KOEFISIEN_AHS,
    })
        .then((AHSProjectUtama) => {
            res.status(201).json({
                message: "Success Post New AHS Project Utama to Database",
                AHSProjectUtama: AHSProjectUtama,
            });
        })
        .catch((err) => {
            res.status(500).json({ error: err });
            console.log(err);
        });
};

exports.postNewAHSProjectDetail = (req, res, next) => {
    console.log("postNewAHSProjectDetails");
    const TAHUN = req.query.TAHUN;
    const ID_AHS_PROJECT_UTAMA = req.body.ID_AHS_PROJECT_UTAMA;
    const P_URAIAN = req.body.P_URAIAN;
    const P_KELOMPOK_URAIAN = req.body.P_KELOMPOK_URAIAN;
    const P_SATUAN_URAIAN = req.body.P_SATUAN_URAIAN;
    const P_KOEFISIEN_URAIAN = req.body.P_KOEFISIEN_URAIAN;
    const P_KETERANGAN_URAIAN = req.body.P_KETERANGAN_URAIAN;
    const P_HS_ANAK_AHS = req.body.P_HS_ANAK_AHS;
    const P_HS_AHS_P = req.body.P_HS_AHS_P;
    const ID_HS = req.body.ID_HS;

    AHSProjectDetail[TAHUN].create({
        ID_AHS_PROJECT_UTAMA: ID_AHS_PROJECT_UTAMA,
        P_URAIAN: P_URAIAN,
        P_KELOMPOK_URAIAN: P_KELOMPOK_URAIAN,
        P_SATUAN_URAIAN: P_SATUAN_URAIAN,
        P_KOEFISIEN_URAIAN: P_KOEFISIEN_URAIAN,
        ID_HS: ID_HS,
        P_KETERANGAN_URAIAN: P_KETERANGAN_URAIAN,
        P_HS_ANAK_AHS: P_HS_ANAK_AHS,
        P_HS_AHS_P: P_HS_AHS_P,
    })
        .then((AHSProjectDetail) => {
            res.status(201).json({
                message: "Success Post New AHS Project Detail to Database",
                AHSProjectDetail: AHSProjectDetail,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};
