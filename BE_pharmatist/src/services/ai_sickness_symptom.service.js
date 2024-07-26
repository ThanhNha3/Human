const AiSicknessSymptomModel = require('../models/ai_sickness_symptom.model');

class AiSicknessSymptomService {
    async create(req) {
        try {
            return await AiSicknessSymptomModel.create(req)
        } catch (error) {
            console.log(error);
            return error
        }
    }
    async findAllById(req) {
        try {
            const res = await AiSicknessSymptomModel.findAll({ where: { ai_symptoms_id: req } })
            return res
        } catch (error) {
            console.log(error);
            return error
        }
    }
    async findSymptomByName(req) {
        try {
            const res = await AiSicknessSymptomModel.findOne({ where: { name: req } })
            return res
        } catch (error) {
            console.log(error);
            return error
        }
    }
}

module.exports = new AiSicknessSymptomService();

