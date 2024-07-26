const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TextInputModel = sequelize.define('text_input', {
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})
module.exports = TextInputModel;