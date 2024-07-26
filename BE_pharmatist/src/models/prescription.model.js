const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PrescriptionModel = sequelize.define('prescription', {
    underlying_condition: {
        type: DataTypes.STRING,
    },
    symptoms: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    note: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending'
    }
})
module.exports = PrescriptionModel;