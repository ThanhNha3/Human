const PrescriptionModel = require("../models/prescription.model");
const SicknessMedicineModel = require("../models/sickness-medicine.model");
const sicknessMedicineService = require("./sickness-medicine.service");

class PrescriptionService {
    async findAll(req) {
        try {
            return await PrescriptionModel.findAll({
                where: { status: req.query.status }
            })
        } catch (error) {
            return error
        }
    }
    async findAllByDoctorAndPharmartist(req) {
        try {
            return await PrescriptionModel.findAll({
                where: { id: req.query.id }
            })
        } catch (error) {
            return error
        }
    }
    async create(req) {
        try {
            return await PrescriptionModel.create(req)
        } catch (error) {
            console.log(error);
            return error
        }
    }
    async update(req) {
        try {
            if (req.query.id) {
                const response = await sicknessMedicineService.update(req, {
                    where: {
                        sicknessId: req.query.id,
                        medicineId: req.body.medicineId
                    }
                })
                if (response) {
                    return SicknessMedicineModel.findOne({ where: { sicknessId: req.query.id, medicineId: req.body.medicineId } })
                }
            }
            else {
                const { user_id, id } = req.params;
                const response = await PrescriptionModel.update(req.body, {
                    where: {
                        id: id,
                        created_by: user_id
                    }
                })
                if (response) {
                    return PrescriptionModel.findOne({ where: { id: id, created_by: user_id } })
                }
            }
        } catch (error) {
            return error
        }
    }
    async findById(id) {
        try {

            console.log(id);
            return await PrescriptionModel.findByPk(id)
        } catch (error) {
            return error
        }
    }
    async getAllPrescriptionByUserId(req) {
        try {
            return await PrescriptionModel.findAll({ where: { created_by: req.params.user_id } })
        } catch (error) {
            return error
        }
    }
    async deleteByPrescriptionId(req) {
        try {
            return await PrescriptionModel.destroy({ where: { id: req.params.id, created_by: req.params.user_id } })
        } catch (error) {
            return error
        }
    }
    async findByIdAndUserId(id, userId) {
        try {
            console.log(id, userId);
            return await PrescriptionModel.findOne({ where: { id: id, created_by: userId } })
        } catch (error) {
            return error
        }
    }
}
module.exports = new PrescriptionService()