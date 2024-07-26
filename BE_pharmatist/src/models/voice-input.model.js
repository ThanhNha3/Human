const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const VoiceInputModel = sequelize.define('voice_input', {
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})
module.exports = VoiceInputModel;