const Sequelize = require("sequelize");

const sequelize = require("../../util/database");

const RABJudul = {};

var tahun = 2010;
while (tahun <= 2012) {
    RABJudul[tahun] = sequelize.define(
        "T_RAB_JUDUL_" + tahun,
        {
            ID_RAB_JUDUL: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            ITEM_PEKERJAAN: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            NO_URUT_1: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            NO_URUT_2: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            NO_URUT_3: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            NO_URUT_4: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            NO_URUT_5: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            DETAIL: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },

            // This is foreign key
            // ID_RAB_PROJECT_BAGIAN: {
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
    tahun++;
}

module.exports = RABJudul;
