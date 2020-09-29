const Project = require("../models/Project");
const RABProjectBagian = require("../models/RABProjectBagian");
const RABJudul = require("../models/RABJudul");
const RABDetail = require("../models/RABDetail");
const AHSProjectUtama = require("../models/AHSProjectUtama");
const AHSProjectDetail = require("../models/AHSProjectDetail");

const AHSSumberUtama = require("../models/AHSSumberUtama");
const AHSSumberDetail = require("../models/AHSSumberDetail");
const HS = require("../models/HS");

const HelperHStoExcel = require("../models/HelperHStoExcel");
const HelperAHStoExcel = require("../models/HelperAHStoExcel");

const Wilayah = require("../models/Wilayah");

const databaseRelation = () => {
    var tahun = 2010;
    while (tahun <= 2012) {
        console.log("pppppopopopopopopopopopopopopopopoppopopp");
        Project[tahun].belongsTo(Wilayah, { foreignKey: "ID_WILAYAH" });
        Project[tahun].hasMany(RABProjectBagian[tahun], {
            foreignKey: "ID_PROJECT",
        });
        RABProjectBagian[tahun].hasMany(RABJudul[tahun], {
            foreignKey: "ID_RAB_PROJECT_BAGIAN",
        });
        RABJudul[tahun].hasMany(RABDetail[tahun], {
            foreignKey: "ID_RAB_JUDULS",
        });
        RABDetail[tahun].belongsTo(AHSProjectUtama[tahun], {
            foreignKey: "ID_AHS_PROJECT_UTAMA",
        });

        AHSProjectUtama[tahun].belongsTo(Project[tahun], {
            foreignKey: "ID_PROJECT",
        });
        AHSProjectUtama[tahun].hasMany(AHSProjectDetail[tahun], {
            foreignKey: "ID_AHS_PROJECT_DETAIL",
        });
        AHSProjectUtama[tahun].belongsTo(AHSSumberUtama, {
            foreignKey: "ID_AHS_SUMBER_UTAMA",
        });
        AHSProjectDetail[tahun].belongsTo(HS[tahun], { foreignKey: "ID_HS" }); // Ini untuk cari detail harga P_HS_URAIAN
        // AHSProjectDetail.belongsTo(AHSProjectUtama) //ini untuk P_HS_ANAK_AHS

        HS[tahun].belongsTo(Wilayah, { foreignKey: "ID_AHS_PROJECT_UTAMA" });
        tahun++;
    }
    AHSSumberUtama.hasOne(AHSSumberDetail, { foreignKey: "" });
};

module.exports = databaseRelation;
