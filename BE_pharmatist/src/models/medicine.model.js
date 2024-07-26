const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const MedicineModel= sequelize.define('medicine', {
    image: {
        type: DataTypes.STRING,
    },
    name:{
        type: DataTypes.STRING
    },
    unit:{
        type: DataTypes.STRING,
        allowNull: true
    },
    price:{
        type: DataTypes.DOUBLE,
        allowNull: true
    }
})
module.exports = MedicineModel;