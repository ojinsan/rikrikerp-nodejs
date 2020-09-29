const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const HS = {};

var tahun = 2010;
while (tahun <= 2012) {
    HS[tahun] = sequelize.define(
        "HS_" + tahun,
        {
            ID_HS: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },

            URAIAN: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            SATUAN: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            HARGA: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            TYPE: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            TAHUN: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: tahun,
            },
            SUMBER_HARGA: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            KETERANGAN: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            SCREENSHOOT: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            // This is foreign key
            // WILAYAH_PROJECT: {
            //     type: Sequelize.STRING,
            //     allowNull: false,
            // },
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

module.exports = HS;
