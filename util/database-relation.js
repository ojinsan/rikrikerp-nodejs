const Project = require("../models/Project/Project");
const RABProjectBagian = require("../models/Project/RABProjectBagian");
const RABJudul = require("../models/Project/RABJudul");
const RABDetail = require("../models/Project/RABDetail");

const AHSProjectUtama = require("../models/AHSProject/AHSProjectUtama");
const AHSProjectDetail = require("../models/AHSProject/AHSProjectDetail");

const AHSSumberUtama = require("../models/DataSource/AHSSumberUtama");
const AHSSumberDetail = require("../models/DataSource/AHSSumberDetail");
const HS = require("../models/DataSource/HS");

const HelperHStoExcel = require("../models/Helper/HelperHStoExcel");
const HelperAHStoExcel = require("../models/Helper/HelperAHStoExcel");

const Wilayah = require("../models/Wilayah");

const TAHUN = require("./tahun-list");

const databaseRelation = () => {
  var tahun = TAHUN.fromYear;
  while (tahun <= TAHUN.toYear) {
    Project[tahun].belongsTo(Wilayah, { foreignKey: "ID_WILAYAH" });
    Project[tahun].hasMany(RABProjectBagian[tahun], {
      foreignKey: "ID_PROJECT",
    });
    RABProjectBagian[tahun].hasMany(RABJudul[tahun], {
      foreignKey: "ID_RAB_PROJECT_BAGIAN",
    });
    RABJudul[tahun].hasMany(RABDetail[tahun], {
      foreignKey: "ID_RAB_JUDUL",
    });
    RABDetail[tahun].belongsTo(AHSProjectUtama[tahun], {
      foreignKey: "ID_AHS_PROJECT_UTAMA",
    });

    AHSProjectUtama[tahun].belongsTo(Project[tahun], {
      foreignKey: "ID_PROJECT",
    });
    AHSProjectUtama[tahun].hasMany(AHSProjectDetail[tahun], {
      foreignKey: "ID_AHS_PROJECT_UTAMA",
    });
    AHSProjectUtama[tahun].belongsTo(AHSSumberUtama, {
      foreignKey: "ID_AHS_SUMBER_UTAMA",
    });
    AHSProjectDetail[tahun].belongsTo(HS[tahun], { foreignKey: "ID_HS" }); // Ini untuk cari detail harga P_HS_URAIAN
    // AHSProjectDetail.belongsTo(AHSProjectUtama) //ini untuk P_HS_ANAK_AHS

    HS[tahun].belongsTo(Wilayah, {
      foreignKey: "ID_WILAYAH",
      //as: "HS",
    });
    Wilayah.hasMany(HS[tahun], {
      foreignKey: "ID_WILAYAH",
    });
    tahun++;
  }
  AHSSumberUtama.hasMany(AHSSumberDetail, {
    foreignKey: "ID_AHS_SUMBER_UTAMA",
  });
};

module.exports = databaseRelation;
