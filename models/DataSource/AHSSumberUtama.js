const Sequelize = require("sequelize");

const sequelize = require("../../util/database");

//const AHSUtama = {};

const AHSSumberUtama = sequelize.define(
    "AHS_SUMBER_UTAMA",
    {
        ID_AHS_SUMBER_UTAMA: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        NAMA_AHS: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        NOMOR_AHS: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        SUMBER_AHS: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        SATUAN_AHS: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        SCREENSHOT_AHS: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        KHUSUS: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },

        // This is foreign key
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

module.exports = AHSSumberUtama;
