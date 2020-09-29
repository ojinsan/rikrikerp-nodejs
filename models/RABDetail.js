const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const RABDetail = {};

var tahun = 2010;
while (tahun <= 2012) {
    RABDetail[tahun] = sequelize.define(
        "T_RAB_DETAIL_" + tahun,
        {
            ID_RAB_DETAIL: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            SATUAN: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            VOLUME: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            UPAH_NON_TDP: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            BAHAN_NON_TDP: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            PM: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            // This is foreign key
            // ID_RAB_JUDUL: {
            //     type: Sequelize.INTEGER,
            //     allowNull: false,
            // }

            // This is foreign key
            // AHS_UTAMA_PROJECT_ID: {
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

module.exports = RABDetail;
