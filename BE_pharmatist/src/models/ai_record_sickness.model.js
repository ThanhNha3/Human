const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AiRecordSicknessModel = sequelize.define('ai_record_sickness', {

}, { timestamps: true });

module.exports = AiRecordSicknessModel;