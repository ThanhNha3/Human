const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const SicknessModel = sequelize.define('sickness', {
    prescription_id: {
        type: DataTypes.INTEGER,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    department: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    probability: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
})
module.exports = SicknessModel;