const Sequelize = require("sequelize");

const sequelize = require("../../util/database");
const TAHUN = require("../../util/tahun-list");

const AHSProjectRumus = {};

var tahun = TAHUN.fromYear;
while (tahun <= TAHUN.toYear) {
  AHSProjectRumus[tahun] = sequelize.define(
    "AHS_PROJECT_RUMUS_" + tahun,
    {
      ID_AHS_PROJECT_RUMUS: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      URAIAN: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      VALUE_REFF_1: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      //ID_AHS_UTAMA_PROJECT_1
      // ID_HS_1
      ID_AHS_PROJECT_UTAMA_1: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      NAMA_VAR_1: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      SATUAN_1: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      VALUE_1: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      VALUE_REFF_2: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      //ID_AHS_UTAMA_PROJECT_2
      // ID_HS_2
      ID_AHS_PROJECT_UTAMA_2: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      NAMA_VAR_2: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      SATUAN_2: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      VALUE_2: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      VALUE_REFF_3: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      //ID_AHS_UTAMA_PROJECT_3
      // ID_HS_3
      ID_AHS_PROJECT_UTAMA_3: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      NAMA_VAR_3: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      SATUAN_3: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      VALUE_3: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      RUMUS_DIGUNAKAN: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      UPAH_BAHAN: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
    }
  );
  tahun++;
}

module.exports = AHSProjectRumus;
