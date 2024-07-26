const sequelize = require('../config/db');
const AiRecordMedicineModel = require('../models/ai_record_medicine.model');

class AiRecordMedicineService {
    async create(req) {
        try {
            return await AiRecordMedicineModel.create(req)
        } catch (error) {
            return error
        }
    }

    // Hàm này sẽ trả về danh sách các thuốc dựa trên các bệnh đã được chẩn đoán
    async findMedicineBySickness(req) {
        try {
            const sicknessIds = req; // Giả sử bạn truyền sicknessIds trong phần body của request
            if (!sicknessIds || !Array.isArray(sicknessIds) || sicknessIds.length === 0) {
                throw new Error("Invalid or missing sicknessIds");
            }
            const query = `
              SELECT
    asn.name AS sickness,
    am.id AS id_medicines,
    am.name AS medicines,
    arm.price AS price,
    arm.dosage AS dosage,
    arm.unit AS unit
FROM
    ai_record_medicines arm
JOIN ai_record_sicknesses ars ON
    ars.ai_record_id = arm.ai_record_id
JOIN ai_sicknesses asn ON
    ars.aiSicknessId = asn.id
JOIN ai_medicines am ON
    arm.aiMedicineId = am.id
WHERE
    ars.aiSicknessId IN(:sicknessIds);
            `;
            const results = await sequelize.query(query, {
                replacements: { sicknessIds },
                type: sequelize.QueryTypes.SELECT
            });
            return results;
        } catch (error) {
            return error;
        }
    }

}

module.exports = new AiRecordMedicineService();

