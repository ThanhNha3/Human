const AiRecordModel = require("../models/ai_record.model");

class AiRecordService {
    async create(req) {
        try {
            return await AiRecordModel.create(req)
        } catch (error) {
            return error
        }
    }
}

module.exports = new AiRecordService();

