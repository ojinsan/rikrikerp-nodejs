const Sequelize = require("sequelize");

const sequelize = require("../../util/database");

const MaterialAtBukuZ = {};

var i = 0;
while (i < 0) {
    MaterialAtBukuZ["tahune-" + i] = sequelize.define(
        "tahune-" + i,
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
            freezeTableName: true,
        }
    );
    i++;
}

module.exports = MaterialAtBukuZ;
