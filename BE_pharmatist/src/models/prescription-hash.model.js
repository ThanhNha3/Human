const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PrescriptionHashModel= sequelize.define('prescription_hash', {
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})
module.exports = PrescriptionHashModel;