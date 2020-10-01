const Wilayah = require("../models/Wilayah");

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
