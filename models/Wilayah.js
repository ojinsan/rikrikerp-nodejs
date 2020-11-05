const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Wilayah = sequelize.define(
    "WILAYAH",
    {
        ID_WILAYAH: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },

        WILAYAH: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        DIVRE_DAOP: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        KECAMATAN: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        KABUPATEN_KOTAMADYA: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        PROVINSI: {
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

module.exports = Wilayah;
