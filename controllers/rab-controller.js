const RABProjectBagian = require("../models/Project/RABProjectBagian");
const RABJudul = require("../models/Project/RABJudul");
const RABDetail = require("../models/Project/RABDetail");

// ========================================= MARK: RAB Judul and Detail =========================================
exports.getRABJudulFullData = (req, res, next) => {
    const TAHUN = req.query.TAHUN;
    const ID_RAB_PROJECT_BAGIAN = req.query.ID_RAB_PROJECT_BAGIAN;
    RABJudul[TAHUN].findAll({
        where: {
            ID_RAB_PROJECT_BAGIAN: ID_RAB_PROJECT_BAGIAN,
        },
        include: [
            {
                model: RABDetail[TAHUN],
                request: false,
            },
        ],
    })
        .then((rab) => {
            res.status(201).json({
                message: "Success pull data RAB ",
                rab: rab,
            });
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.postNewRABJudul = (req, res, next) => {};

exports.postNewRABDetail = (req, res, next) => {};

exports.postNewRABJudulDetail = (req, res, next) => {
    const TAHUN = req.query.TAHUN;

    const ID_RAB_PROJECT_BAGIAN = req.body.ID_RAB_PROJECT_BAGIAN;
    const ITEM_PEKERJAAN = req.body.ITEM_PEKERJAAN;
    const NO_URUT_1 = req.body.NO_URUT_1;
    const NO_URUT_2 = req.body.NO_URUT_2;
    const NO_URUT_3 = req.body.NO_URUT_3;
    const NO_URUT_4 = req.body.NO_URUT_4;
    const NO_URUT_5 = req.body.NO_URUT_5;
    const DETAIL = req.body.DETAIL;

    //const ID_RAB_JUDUL = req.body.
    const AHS_UTAMA_PROJECT_ID = req.body.AHS_UTAMA_PROJECT_ID;
    const SATUAN = req.body.SATUAN;
    const VOLUME = req.body.VOLUME;
    const UPAH_NON_TDP = req.body.UPAH_NON_TDP;
    const BAHAN_NON_TDP = req.body.BAHAN_NON_TDP;
    const PM = req.body.PM;

    RABJudul[TAHUN].create({
        ID_RAB_PROJECT_BAGIAN: ID_RAB_PROJECT_BAGIAN,
        ITEM_PEKERJAAN: ITEM_PEKERJAAN,
        NO_URUT_1: NO_URUT_1,
        NO_URUT_2: NO_URUT_2,
        NO_URUT_3: NO_URUT_3,
        NO_URUT_4: NO_URUT_4,
        NO_URUT_5: NO_URUT_5,
        DETAIL: DETAIL,
    })
        .then((RABJudul) => {
            console.log(RABJudul.ID_RAB_JUDUL);
            RABDetail[TAHUN].create({
                ID_RAB_JUDUL: RABJudul.ID_RAB_JUDUL,
                AHS_UTAMA_PROJECT_ID: AHS_UTAMA_PROJECT_ID,
                SATUAN: SATUAN,
                VOLUME: VOLUME,
                UPAH_NON_TDP: UPAH_NON_TDP,
                BAHAN_NON_TDP: BAHAN_NON_TDP,
                PM: PM,
            }).then((RABDetail) => {
                res.status(201).json({
                    message: "Success pull data RAB Project Bagian",
                    RABJudul: RABJudul,
                    RABDetail: RABDetail,
                });
            });
        })
        .catch((error) => {
            console.log(error);
        });
};

// ========================================= MARK: RAB Detail =========================================
