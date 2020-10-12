const Wilayah = require("../models/Wilayah");
const TAHUN = require("../util/tahun-list");

exports.getWilayahFullData = (req, res, next) => {
    Wilayah.findAll()
        .then((data) => {
            res.status(201).json({
                message: "Success get wilayah full data",
                wilayah: data,
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err.message,
            });
        });
};

exports.getYear = (req, res, next) => {
    const TAHUNS = [];
    for (let i = TAHUN.fromYear; i <= TAHUN.toYear; i++) {
        TAHUNS.push(i);
    }
    res.status(201).json({ TAHUNS: TAHUNS });
};

exports.postNewWilayah = (req, res, next) => {
    const WILAYAH = req.body.WILAYAH;
    const DIVRE_DAOP = req.body.DIVRE_DAOP;
    const KECAMATAN = req.body.KECAMATAN;
    const KABUPATEN_KOTAMADYA = req.body.KABUPATEN_KOTAMADYA;
    const PROVINSI = req.body.PROVINSI;

    Wilayah.create({
        WILAYAH: WILAYAH,
        DIVRE_DAOP: DIVRE_DAOP,
        KECAMATAN: KECAMATAN,
        KABUPATEN_KOTAMADYA: KABUPATEN_KOTAMADYA,
        PROVINSI: PROVINSI,
    }).then((Wilayah) => {
        res.status(201)
            .json({
                message: "Create wilayah Success",
                Wilayah: Wilayah,
            })
            .catch((err) => {
                res.status(500).json({
                    message: "Create wilayah Error",
                    error: err,
                });
            });
    });
};

exports.updateWilayah = (req, res, next) => {
    const WILAYAH = req.body.WILAYAH;
    const DIVRE_DAOP = req.body.DIVRE_DAOP;
    const KECAMATAN = req.body.KECAMATAN;
    const KABUPATEN_KOTAMADYA = req.body.KABUPATEN_KOTAMADYA;
    const PROVINSI = req.body.PROVINSI;

    Wilayah.update(
        {
            WILAYAH: WILAYAH,
            DIVRE_DAOP: DIVRE_DAOP,
            KECAMATAN: KECAMATAN,
            KABUPATEN_KOTAMADYA: KABUPATEN_KOTAMADYA,
            PROVINSI: PROVINSI,
        },
        {
            where: {
                ID_WILAYAH: ID_WILAYAH,
            },
        }
    )
        .then((wilayah) => {
            res.status(201).json({
                message: "Success Edit Wilayah to Database",
                wilayah: wilayah,
            });
        })
        .catch((err) => {
            res.status(500).json({ error: err });
            console.log(err);
        });
};
