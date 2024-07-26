const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AiSicknessSymptomModel = sequelize.define('ai_sickness_symptoms', {
    ai_sicknesses_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ai_symptoms_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, { timestamps: true });

module.exports = AiSicknessSymptomModel;
