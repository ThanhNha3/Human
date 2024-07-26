const sequelize = require("../config/db");
const SicknessModel = require("../models/sickness.model")

class SicknessService {
    async create(req) {
        try {
            return await SicknessModel.create(req)
        } catch (error) {
            console.log(error);
            return error
        }
    }
    async findByPrescriptionId(id) {
        try {
            return await SicknessModel.findAll({ where: { prescription_id: id } })
        } catch (error) {
            return error
        }
    }
    async findById(prescription_id) {
        try {
            return await SicknessModel.findAll({ where: { prescription_id: prescription_id } })
        }
        catch (error) {
            return { message: "Không tìm thấy bệnh nhân này trong đơn thuốc này" }
        }
    }
    async edit(id, sicknessData) {
        try {
            console.log(sicknessData);
            return await SicknessModel.update(sicknessData, {
                where: {
                    id
                }
            })
        } catch (error) {
            return error
        }
    }
    async delete(req) {
        try {
            const { prescription_id, id } = req
            return await SicknessModel.destroy({
                where: {
                    prescription_id: Number(prescription_id),
                    id: Number(id)
                }
            })
        } catch (error) {
            return error
        }
    }
    async findSicknessByName(name) {
        try {
            return await SicknessModel.findOne({ where: { name: name } })
        } catch (error) {
            return error
        }
    }
    async getAllSicknessByPrescriptionId(req) {
        try {
            const prescriptionId = req.params.id;
            const query = `
       SELECT p.id as prescription_id, s.id as id, s.name as name, s.probability as probability,s.department as department FROM prescriptions p 
JOIN sicknesses s ON s.prescription_id = p.id
WHERE p.id = :prescriptionId;
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
    // async findById(req) {
    //     try {
    //         console.log(req.params.id);
    //         return await SicknessModel.findOne({ where: { id: req.params.id, created_by: req.params.user_id } })
    //     } catch (error) {
    //         return error
    //     }
    // }
    // async getAllPrescriptionByUserId(req) {
    //     try {
    //         return await SicknessModel.findAll({ where: { created_by: req.params.user_id } })
    //     } catch (error) {
    //         return error
    //     }
    // }
}
module.exports = new SicknessService()