const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UserAllergicModel = sequelize.define('user_allergic', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
})
module.exports = UserAllergicModel;