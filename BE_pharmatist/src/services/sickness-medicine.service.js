const SicknessMedicineModel = require("../models/sickness-medicine.model");

class SicknessMedicineService {
    async create(req) {
        try {
            return await SicknessMedicineModel.create(req)
        } catch (error) {
            console.log(error);
            return error
        }
    }
    async findById(sicknessId, medicineId) {
        try {
            return await SicknessMedicineModel.findAll({ where: { sicknessId: sicknessId } })
        } catch (error) {
            return error
        }
    }
    async update(req) {
        try {
            return await SicknessMedicineModel.update(req.body, { where: { sicknessId: req.query.id, medicineId: req.body.medicineId } })
        } catch (error) {
            return error
        }
    }
    async delete(req) {
        try {
            return await SicknessMedicineModel.destroy({ where: { id: req.params.id } })
        } catch (error) {
            return error
        }
    }
}
module.exports = new SicknessMedicineService()