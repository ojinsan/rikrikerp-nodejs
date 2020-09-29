const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const AHSProjectDetail = {};

var tahun = 2010;
while (tahun <= 2012) {
    AHSProjectDetail[tahun] = sequelize.define(
        "AHS_PROJECT_DETAIL_" + tahun,
        {
            ID_AHS_PROJECT_DETAIL: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            P_URAIAN: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            P_KELOMPOK_URAIAN: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            P_SATUAN_URAIAN: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            P_KOEFISIEN_URAIAN: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            P_KETERANGAN_URAIAN: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            P_HS_AHS_P: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },

            // This is foreign key

            // This is foreign key
            // ID_AHS_PROJECT_UTAMA: {
            //     type: Sequelize.INTEGER,
            //     allowNull: false,
            // }

            // P_HS_URAIAN: {
            //     type: Sequelize.INTEGER,
            //     allowNull: false,
            // }

            // P_HS_ANAK_AHS: {
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
    tahun++;
}

module.exports = AHSProjectDetail;
