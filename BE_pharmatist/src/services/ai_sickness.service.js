const AiSicknessModel = require("../models/ai_sickness.model")


class AiSicknessService {
    async findSicknessByName(name) {
        try {
            return await AiSicknessModel.findOne({ where: { name: name } })
        } catch (error) {
            return error
        }
    }
    async findSicknessById(id) {
        try {
            return await AiSicknessModel.findOne({ where: { id: id } })
        } catch (error) {
            return error
        }
    }
    async create(req) {
        try {
            return await AiSicknessModel.create(req)
        } catch (error) {
            return error
        }
    }
}

module.exports = new AiSicknessService();

