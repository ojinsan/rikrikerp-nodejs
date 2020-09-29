const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Project = {};

var tahun = 2010;
while (tahun <= 2012) {
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
