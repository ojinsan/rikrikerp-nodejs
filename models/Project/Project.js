const Sequelize = require("sequelize");
const TAHUN = require("../../util/tahun-list");

const sequelize = require("../../util/database");

const Project = {};

var tahun = TAHUN.fromYear;
while (tahun <= TAHUN.toYear) {
  Project[tahun] = sequelize.define(
    "T_PROJECT_" + tahun,
    {
      ID_PROJECT: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      NAMA_PROJECT: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      TAHUN: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: tahun,
      },
      // This is foreign key
      // WILAYAH_PROJECT: {
      //     type: Sequelize.STRING,
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
  tahun++;
}

module.exports = Project;
