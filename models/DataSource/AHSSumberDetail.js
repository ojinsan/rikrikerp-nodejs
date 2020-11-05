const Sequelize = require("sequelize");
const TAHUN = require("../../util/tahun-list");

const sequelize = require("../../util/database");

const AHSSumberDetail = sequelize.define(
  "AHS_SUMBER_DETAIL",
  {
    ID_AHS_SUMBER_DETAIL: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    URAIAN: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    KODE_URAIAN: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    KELOMPOK_URAIAN: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    SATUAN_URAIAN: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    KOEFISIEN_URAIAN: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    KETERANGAN_URAIAN: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    // This is foreign key
    // ID_AHS_UTAMA: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,
    // }
  },
  {
    // look up the table faster, but write the table slower
    // indexes: [
    //     {
    //         unique: false,
    //         fields: ["WILAYAH"],
    //     },
    // ],
    freezeTableName: true,
  }
);

module.exports = AHSSumberDetail;
