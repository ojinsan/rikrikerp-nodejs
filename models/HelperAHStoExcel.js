const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const HelperHStoExcel = sequelize.define(
    "HS_EXCEL",
    {
        ID_AHS_TO_EXCEL: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        POSISI_NO_URUT: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        POSISI_P_TOTAL_UPAH: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        POSISI_P_TOTAL_BAHAN: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        // This is foreign key
        // ID_AHS_PROJET_UTAMA: {
        //     type: Sequelize.INTEGER,
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

module.exports = Wilayah;
