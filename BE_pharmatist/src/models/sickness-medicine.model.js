const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const SicknessMedicineModel = sequelize.define('sickness_medicine', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    dosage: {
        type: DataTypes.STRING,
        allowNull: true,
    }
})
module.exports = SicknessMedicineModel;