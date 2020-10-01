const HS = require("../models/DataSource/HS");
const Wilayah = require("../models/Wilayah");

exports.getHSFullData = (req, res, next) => {
    HS[TAHUN].findAll({
        include: [
            {
                model: Wilayah,
                required: false,
            },
        ],
    }).then((HS) => {
        res.status(201).json({
            message: "Success Get HS",
            HS: HS,
        });
    });
};

exports.getHSFullDataGroupByWilayah = (req, res, next) => {
    const TAHUN = req.query.TAHUN;
    console.log(TAHUN);

    Wilayah.findAll({
        include: [
            {
                model: HS[TAHUN],
                required: false,
            },
        ],
    })
        .then((Wilayah) => {
            var newWilayah = [];
            Wilayah.map((satuWilayah) => {
                const satuWilayahTemp = JSON.parse(JSON.stringify(satuWilayah));
                const satuHS = satuWilayahTemp["HS_" + TAHUN + "s"];
                delete satuWilayahTemp["HS_" + TAHUN + "s"];
                satuWilayahTemp["HS"] = satuHS;
                newWilayah.push(satuWilayahTemp);
            });

            res.status(201).json({
                message: "Success Get HS",
                Wilayah: newWilayah,
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
            console.log(err);
        });
};

exports.postNewHS = (req, res, next) => {
    const URAIAN = req.body.URAIAN;
    const SATUAN = req.body.SATUAN;
    const HARGA = req.body.HARGA;
    const TYPE = req.body.TYPE;
    const TAHUN = req.body.TAHUN;
    const SUMBER_HARGA = req.body.SUMBER_HARGA;
    const KETERANGAN = req.body.KETERANGAN;
    const SCREENSHOT_HS = req.body.SCREENSHOT_HS;
    const ID_WILAYAH = req.body.ID_WILAYAH;

    HS[TAHUN].create({
        URAIAN: URAIAN,
        SATUAN: SATUAN,
        HARGA: HARGA,
        TYPE: TYPE,
        ID_WILAYAH: ID_WILAYAH,
        TAHUN: TAHUN,
        SUMBER_HARGA: SUMBER_HARGA,
        KETERANGAN: KETERANGAN,
        SCREENSHOT_HS: SCREENSHOT_HS,
    }).then((HS) => {
        res.status(201)
            .json({
                message: "Success Post New HS to Database",
                HS: HS,
            })
            .catch((err) => {
                res.status(500).json({ error: err });
                console.log(err);
            });
    });
};
