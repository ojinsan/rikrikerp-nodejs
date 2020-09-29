const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const RABProjectBagian = {};

var tahun = 2010;
while (tahun <= 2012) {
    RABProjectBagian[tahun] = sequelize.define(
        "T_RAB_PROJECT_BAGIAN_" + tahun,
        {
            ID_RAB_PROJECT_BAGIAN: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            JENIS: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            BAGIAN: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: tahun,
            },
            SUB_BAGIAN: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            ID_TTD: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            KETERANGAN_JUDUL_REKAP: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            JUMLAH_RAB: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            TOTAL_UPAH_TDP: {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },
            TOTAL_BAHAN_TDP: {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },
            TOTAL_UPAH_NON_TDP: {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },
            TOTAL_BAHAN_NON_TDP: {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },
            KETERANGAN_BAG_BAWAH_RAB: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            // This is foreign key
            // ID_PROJECT: {
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

module.exports = RABProjectBagian;
