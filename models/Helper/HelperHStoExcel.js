const Sequelize = require("sequelize");

const sequelize = require("../../util/database");

const HelperHStoExcel = sequelize.define(
    "HS_EXCEL",
    {
        ID_HS_TO_EXCEL: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },

        POSITION: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        // This is foreign key
        // ID_HS: {
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

module.exports = HelperHStoExcel;
