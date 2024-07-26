const ai_recordService = require("../services/ai_record.service");
const ai_record_medicineService = require("../services/ai_record_medicine.service");
const ai_record_sicknessService = require("../services/ai_record_sickness.service");
const ai_sickness_symptomService = require("../services/ai_sickness_symptom.service");
const ai_symptomService = require("../services/ai_symptom.service");
const sicknessService = require("../services/sickness.service");

class AiRecordController {
    async create(req, res) {
        try {
            console.log("đây là thêm vào DB AI Record");
            const aiRecordCreated = await ai_recordService.create({});
            const medicines = req.body.medicines;
            let sicknesses = req.body.sicknesses;
            let symptoms = req.body.symptoms;

            console.log("medicines", medicines);

            // Thêm vào DB AI Record Medicine
            await Promise.all(medicines.map(async (medicine) => {
                console.log("medicine", medicine);
                await ai_record_medicineService.create({
                    ai_record_id: aiRecordCreated.id,
                    aiMedicineId: medicine.id,
                    price: medicine.price,
                    unit: medicine.unit,
                    dosage: medicine.dosage,
                });
            }));

            sicknesses = sicknesses.split(",").map((sickness) => sickness.trim());
            symptoms = symptoms.split(",").map((symptom) => symptom.trim());

            const symptomIdsArray = await Promise.all(symptoms.map(async (symptom) => {
                const symptomFromDBAI = await ai_symptomService.findSymptomByName(symptom);
                if (symptomFromDBAI) {
                    return symptomFromDBAI.id;
                } else {
                    const symptomCreated = await ai_symptomService.create(symptom);
                    return symptomCreated.id
                }
            }));

            // Thêm vào DB AI Record Sickness
            await Promise.all(sicknesses.map(async (sickness) => {
                const sicknessFromDB = await sicknessService.findSicknessByName(sickness);
                if (sicknessFromDB) {
                    await ai_record_sicknessService.create({ ai_record_id: aiRecordCreated.id, aiSicknessId: sicknessFromDB.id });
                    await Promise.all(symptomIdsArray.map(async (symptomId) => {
                        await ai_sickness_symptomService.create({ ai_sicknesses_id: sicknessFromDB.id, ai_symptoms_id: symptomId });
                    }));
                    console.log("Đã thêm thành công sickness_symptom_ai vào DB");
                } else {
                    console.log(`Không tìm thấy sickness với tên: ${sickness}`);
                }
            }));
            for (const sickness of sicknesses) {
                const sicknessFromDB = await sicknessService.findSicknessByName(sickness);
                if (sicknessFromDB) {
                    await ai_record_sicknessService.create({ ai_record_id: aiRecordCreated.id, aiSicknessId: sicknessFromDB.id });
                } else {
                    console.log(`Không tìm thấy sickness với tên: ${sickness}`);
                }
            }
            // await ai_sickness_symptomService.create({ ai_sicknesses_id: sicknessFromDB.id, ai_symptoms_id: aiRecordCreated.id });
            return res.status(200).json({ message: "Thêm vào DB AI thành công" });
        } catch (error) {
            console.log("error nèeee", error);
            return res.status(500).json({ message: error.message });
        }
    }
}
module.exports = new AiRecordController()