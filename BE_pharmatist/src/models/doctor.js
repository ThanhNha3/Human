const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DoctorModel = sequelize.define('doctor', {
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    birthday: {
        type: DataTypes.DATE,
    },
    address: {
        type: DataTypes.STRING,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'doctor'
    },
    gender:{
        type: DataTypes.STRING,
    }
})
module.exports = DoctorModel;