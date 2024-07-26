const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AiSicknessModel = sequelize.define('ai_sickness', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, { timestamps: true });
module.exports = AiSicknessModel;