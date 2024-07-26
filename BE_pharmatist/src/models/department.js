const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DepartmentModel = sequelize.define('department', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})
module.exports = DepartmentModel;