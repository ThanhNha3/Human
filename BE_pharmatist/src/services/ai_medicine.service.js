const AiMedicineModel = require("../models/ai_medicine.model")

class AiMedicineService {
    async findMedicineByName(name) {
        try {
            return await AiMedicineModel.findOne({ where: { name: name } })
        } catch (error) {
            return error
        }
    }
    async findMedicineById(name) {
        try {
            return await AiMedicineModel.findOne({ where: { name: name } })
        } catch (error) {
            return error
        }
    }
    async create(req) {
        try {
            return await AiMedicineModel.create(req)
        } catch (error) {
            return error
        }
    }
}

module.exports = new AiMedicineService();

