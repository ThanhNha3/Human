const AiSymptomModel = require("../models/ai_symptoms.model")
const { Op } = require("sequelize");


class AiSymptomService {
    async findSymptomByName(name) {
        try {
            return await AiSymptomModel.findOne({ where: { name: name } })
        } catch (error) {
            return error
        }
    }
    async findSymptomById(id) {
        try {
            return await AiSymptomModel.findOne({ where: { id: id } })
        } catch (error) {
            return error
        }
    }
    async create(req) {
        try {
            return await AiSymptomModel.create(req)
        } catch (error) {
            return error
        }
    }
    async findLikeName(req){
        try {
            let res = await AiSymptomModel.findAll({ where: { name: { [Op.like]: '%'+req+'%' } } })
            return res
        } catch (error) {
            return error
        }
    }
}

module.exports = new AiSymptomService();

