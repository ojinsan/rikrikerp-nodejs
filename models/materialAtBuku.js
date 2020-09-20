const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const MaterialAtBuku = sequelize.define(
    "materialAtBuku",
    {
        idBukuRef: Sequelize.STRING,
        namaBukuRef: { type: Sequelize.STRING, allowNull: false },
        idMaterial: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        namaMaterial: { type: Sequelize.STRING, allowNull: false },
        satuan: Sequelize.STRING,
        koefisien: Sequelize.STRING,
    },
    {
        indexes: [
            {
                unique: false,
                fields: ["namaBukuRef"],
            },
        ],
    }
);

module.exports = MaterialAtBuku;
