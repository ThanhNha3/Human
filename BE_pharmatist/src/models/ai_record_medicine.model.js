
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AiRecordMedicineModel = sequelize.define('ai_record_medicines', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dosage: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, { timestamps: true });

module.exports = AiRecordMedicineModel;