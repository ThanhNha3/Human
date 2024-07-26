const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AiMedicineModel = sequelize.define('ai_medicines', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { timestamps: true });

module.exports = AiMedicineModel;