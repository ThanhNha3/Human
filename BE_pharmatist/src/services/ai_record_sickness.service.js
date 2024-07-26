const AiRecordSicknessModel = require('../models/ai_record_sickness.model');

class AiRecordSicknessService {
    async create(req) {
        try {
            return await AiRecordSicknessModel.create(req)
        } catch (error) {
            return error
        }
    }
}

module.exports = new AiRecordSicknessService();

