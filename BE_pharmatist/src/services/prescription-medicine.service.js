const sequelize = require("../config/db");
const { MedicineModel } = require("../models")
const PrescriptionMedicineModel = require("../models/prescription-medicine.model")

class PresriptionMedicineService {
    async create(req) {
        try {
            if (req.body) {
                return await PrescriptionMedicineModel.create(req.body)
            }
            console.log("Đây là req", req);
            return await PrescriptionMedicineModel.create(req)
        } catch (error) {
            return error
        }
    }
    async findByPrescriptionId(prescriptionId) {
        try {
            return await PrescriptionMedicineModel.findAll(
                {
                    where: { prescriptionId: prescriptionId }
                }
            )
        } catch (error) {
            return error
        }
    }
    async removeMedicineById(req) {
        try {
            return await PrescriptionMedicineModel.destroy({ where: { prescriptionId: req.params.id, medicineId: req.params.medicineId } })
        } catch (error) {
            return error
        }
    }
    async editByPrescriptionId(req) {
        try {
            return await PrescriptionMedicineModel.update(req.body, { where: { prescriptionId: req.params.id, medicineId: req.params.medicineId } })
        } catch (error) {
            return error
        }
    }
    async findAll() {
        try {
            return await PrescriptionMedicineModel.findAll()
        } catch (error) {
            return error
        }
    }
    async findAllByStatus(prescriptionId) {
        try {
            return await PrescriptionMedicineModel.findAll({ where: { status: "accepted", prescriptionId: prescriptionId } })
        } catch (error) {
            return error
        }
    }
    async confirmedPrescriptionMedicine(req) {
        try {
            return await PrescriptionMedicineModel.update({ status: "confirmed" }, { where: { prescriptionId: req.params.id } })
        } catch (error) {
            return error
        }
    }
    async acceptedPrescriptionMedicine(req) {
        try {
            return await PrescriptionMedicineModel.update({ status: "accepted" }, { where: { prescriptionId: req.params.id } })
        } catch (error) {
            return error
        }
    }
    async findById(req) {
        try {
            return await PrescriptionMedicineModel.findByPk(req.params.id)
        } catch (error) {
            return error
        }
    }
    async findAllPrescriptionMedicineByPrescriptionId(req) {
        try {
            const prescriptionId = req.params.id;
            const query = `
       SELECT m.id, m.name, pm.quantity, pm.dosage, pm.status, pm.prescriptionId FROM prescription_medicines pm
JOIN medicines m ON m.id = pm.medicineId
WHERE pm.prescriptionId = :prescriptionId;
          `;
            const results = await sequelize.query(query, {
                replacements: { prescriptionId },
                type: sequelize.QueryTypes.SELECT
            });
            return results;
        } catch (error) {
            console.log("error", error);
            return error
        }
    }
}
module.exports = new PresriptionMedicineService()