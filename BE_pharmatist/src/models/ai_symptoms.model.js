const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AiSymptomModel = sequelize.define('ai_symptoms', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { timestamps: true });

module.exports = AiSymptomModel;