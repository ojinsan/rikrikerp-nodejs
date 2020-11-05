const Sequelize = require("sequelize");

const sequelize = require("../../util/database");

const MaterialAtSurvey = sequelize.define(
    "materialAtSurvey",
    {
        idSurveyRef: Sequelize.STRING,
        namaSurveyRef: { type: Sequelize.STRING, allowNull: false },
        idMaterial: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        namaMaterial: { type: Sequelize.STRING, allowNull: false },
        //satuan: Sequelize.STRING,
        harga: Sequelize.DOUBLE,
    },
    {
        indexes: [
            {
                unique: false,
                fields: ["namaSurveyRef"],
            },
        ],
    }
);

module.exports = MaterialAtSurvey;
