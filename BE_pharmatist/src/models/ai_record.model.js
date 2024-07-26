const sequelize = require("../config/db");

const AiRecordModel = sequelize.define('ai_record', {
}, { timestamps: true });

module.exports = AiRecordModel;