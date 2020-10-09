const Project = require("../models/Project/Project");
const RABProjectBagian = require("../models/Project/RABProjectBagian");
const RABJudul = require("../models/Project/RABJudul");
const RABDetail = require("../models/Project/RABDetail");

exports.getProjectFullData = (req, res, next) => {
    const TAHUN = req.query.TAHUN;
    Project[TAHUN].findAll({
        include: [
            {
                model: RABProjectBagian[TAHUN],
                request: false,
            },
        ],
    })
        .then((projects) => {
            return (newProjects = projects.map((satuProject) => {
                const satuProjectTemp = JSON.parse(JSON.stringify(satuProject));
                const RABPB =
                    satuProjectTemp["T_RAB_PROJECT_BAGIAN_" + TAHUN + "s"];
                delete satuProjectTemp["T_RAB_PROJECT_BAGIAN_" + TAHUN + "s"];
                satuProjectTemp["RAB_PROJECT_BAGIAN"] = RABPB;
                return satuProjectTemp;
            }));
        })
        .then((projects) => {
            res.status(201).json({
                message: "Success pull data project",
                projects: projects,
            });
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.postNewProject = (req, res, next) => {
    const NAMA_PROJECT = req.body.NAMA_PROJECT;
    const ID_WILAYAH = req.body.ID_WILAYAH;
    const TAHUN = req.query.TAHUN;

    Project[TAHUN].create({
        NAMA_PROJECT: NAMA_PROJECT,
        ID_WILAYAH: ID_WILAYAH,
        TAHUN: TAHUN,
    })
        .then((project) => {
            res.status(201).json({
                message: "Success Post New Project to Database",
                project: project,
            });
        })
        .catch((err) => {
            res.status(500).json({ error: err });
            console.log(err);
        });
};

// ========================================= MARK: RAB Project Bagian =========================================
exports.getRABProjectBagianFullData = (req, res, next) => {
    const ID_PROJECT = req.query.ID_PROJECT;
    const TAHUN = req.query.TAHUN;
    RABProjectBagian[TAHUN].findAll({
        where: { ID_PROJECT: ID_PROJECT },
        include: [
            {
                model: RABJudul[TAHUN],
                request: false,
                include: [
                    {
                        model: RABDetail[TAHUN],
                        request: false,
                    },
                ],
            },
        ],
    })
        .then((RABProjectBagian) => {
            res.status(201).json({
                message: "Success pull data RAB Project Bagian",
                RABProjectBagian: RABProjectBagian,
            });
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.postNewRABProjectBagian = (req, res, next) => {
    const ID_PROJECT = req.body.ID_PROJECT;
    const JENIS = req.body.JENIS;
    const BAGIAN = req.body.BAGIAN;
    const SUB_BAGIAN = req.body.SUB_BAGIAN;

    const KETERANGAN_JUDUL_REKAP = req.body.KETERANGAN_JUDUL_REKAP;
    const KETERANGAN_BAG_BAWAH_RAB = req.body.KETERANGAN_BAG_BAWAH_RAB;

    // const ID_TTD = req.body.ID_TTD;
    // const TOTAL_UPAH_TDP = req.body.TOTAL_UPAH_TDP;
    // const TOTAL_BAHAN_TDP = req.body.TOTAL_BAHAN_TDP;
    // const TOTAL_UPAH_NON_TDP = req.body.TOTAL_UPAH_NON_TDP;
    // const TOTAL_BAHAN_NON_TDP = req.body.TOTAL_BAHAN_NON_TDP;
    // const JUMLAH_RAB = req.body.JUMLAH_RAB;

    const ID_TTD = req.body.ID_TTD;
    const TOTAL_UPAH_TDP = 0;
    const TOTAL_BAHAN_TDP = 0;
    const TOTAL_UPAH_NON_TDP = 0;
    const TOTAL_BAHAN_NON_TDP = 0;
    const JUMLAH_RAB = 1;

    const TAHUN = req.query.TAHUN;

    RABProjectBagian[TAHUN].create({
        ID_PROJECT: ID_PROJECT,
        JENIS: JENIS,
        BAGIAN: BAGIAN,
        SUB_BAGIAN: SUB_BAGIAN,
        ID_TTD: ID_TTD,
        KETERANGAN_JUDUL_REKAP: KETERANGAN_JUDUL_REKAP,
        JUMLAH_RAB: JUMLAH_RAB,
        TOTAL_UPAH_TDP: TOTAL_UPAH_TDP,
        TOTAL_BAHAN_TDP: TOTAL_BAHAN_TDP,
        TOTAL_UPAH_NON_TDP: TOTAL_UPAH_NON_TDP,
        TOTAL_BAHAN_NON_TDP: TOTAL_BAHAN_NON_TDP,
        KETERANGAN_BAG_BAWAH_RAB: KETERANGAN_BAG_BAWAH_RAB,
    })
        .then((RABProjectBagian) => {
            res.status(201).json({
                message: "Success Post New RAB Project Bagian to Database",
                RABProjectBagian: RABProjectBagian,
            });
        })
        .catch((err) => {
            res.status(500).json({ error: err });
            console.log(err);
        });
};
