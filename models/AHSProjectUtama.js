const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const AHSProjectUtama = {};

var tahun = 2010;
while (tahun <= 2012) {
    AHSProjectUtama[tahun] = sequelize.define(
        "AHS_PROJECT_UTAMA_" + tahun,
        {
            ID_AHS_PROJECT_UTAMA: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },

            NAMA_AHS_PROJECT: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            NO_URUT: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            KOEFISIEN_AHS: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            PENJELASAN_KOEFISIEN_AHS: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            // This is foreign key
            // ID_PROJECT: {
            //     type: Sequelize.INTEGER,
            //     allowNull: false,
            // }

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
    tahun++;
}

module.exports = AHSProjectUtama;
