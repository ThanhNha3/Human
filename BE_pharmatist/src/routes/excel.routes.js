const express = require('express');
const fileUpload = require('express-fileupload');
const XLSX = require('xlsx');
const ai_sicknessService = require('../services/ai_sickness.service');
const AiMedicineService = require('../services/ai_medicine.service');
const geminiService = require('../services/gemini.service');
const AiSymptomService = require('../services/ai_symptom.service');
const ai_sickness_symptomService = require('../services/ai_sickness_symptom.service');
const AiRecordMedicineModel = require('../models/ai_record_medicine.model');
const AiRecordModel = require('../models/ai_record.model');
const AiRecordSicknessModel = require('../models/ai_record_sickness.model');
const ai_medicineService = require('../services/ai_medicine.service');
const { a } = require('../controllers/allergic.controller');
const AiSicknessSymptomModel = require('../models/ai_sickness_symptom.model');
const sequelize = require('../config/db');

const router = express.Router();

// Tách dữ liệu thuốc
const extractDrugInfo = (inputString) => {
    const drugInfo = [];
    const drugPattern = /([^;:]+)\s*\(([^)]+)\)\s*[:;]/g;

    let match;
    while ((match = drugPattern.exec(inputString))) {
        let [, drugName, details] = match;
        let quantity, unit = null, dosage = null;

        // Tách số lượng và đơn vị
        const quantityUnitMatch = details.match(/(\d+)\s*([^\d]+)/);
        if (quantityUnitMatch) {
            [, quantity, unit] = quantityUnitMatch;
        } else {
            quantity = details; // Nếu không tìm thấy đơn vị, coi toàn bộ details là số lượng
        }

        // Thêm thông tin thuốc vào mảng
        drugInfo.push({
            "name": drugName.trim(),
            "price": null,
            "unit": unit ? unit.trim() : null,
            "dosage": quantity ? quantity.trim() : null // Nếu không tìm thấy số lượng, liều dùng là null
        });
    }
    return drugInfo;
}

const uploadOpts = {
    useTempFiles: true,
    tempFileDir: '/tmp/',
};

const sleep = async (time) => {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

const processAndCreateSymptoms = async (sickness) => {
    await sleep(5000);
    const result = await geminiService.generateSymptom(sickness.name);
    console.log("Đây là result", result);
    if (result.symptoms.length > 0) {
        const sicknessId = sickness.id;
        result.symptoms.map(async (symptom) => {
            symptom = symptom.trim();
            const symptomExist = await AiSymptomService.findSymptomByName(symptom);
            let symptomId = null;
            if (!symptomExist) {
                const symptomCreated = await AiSymptomService.create({ name: symptom });
                symptomId = symptomCreated.id;
            }
            else {
                symptomId = symptomExist.id;
            }
            const sicknessSymptomExist = await AiSicknessSymptomModel.findOne({ where: { ai_sicknesses_id: sicknessId, ai_symptoms_id: symptomId } });
            if (!sicknessSymptomExist) {
                await ai_sickness_symptomService.create({ ai_sicknesses_id: sicknessId, ai_symptoms_id: symptomId })
            }
        })
    }
}

const removeDuplicatesByName = (array) => {
    const seen = new Set();
    return array.filter(item => {
        const name = item.name.trim();
        if (seen.has(name)) {
            return false;
        } else {
            seen.add(name);
            return true;
        }
    });
}

router.post("/import", fileUpload(uploadOpts), async (req, res) => {
    try {
        const { excel } = req.files;
        if (excel.mimetype !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            return res.status(400).json({ message: "File is invalid!" });
        }

        const workbook = XLSX.readFile(excel.tempFilePath);
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // -------------------PHẦN BỆNH VÀ TRIỆU CHỨNG--------------------
        // let addedSicknessArray = [];
        // let addedMedicineArray = [];

        // for (const drug of data) {
        //     const record = await AiRecordModel.create({});

        //     const sicknessArray = drug.sicknesses.split(';').map(item => item.trim());
        //     for (let sickness of sicknessArray) {
        //         sickness = sickness.trim();
        //         if (!addedSicknessArray.includes(sickness)) {
        //             let aiSicknessCreated = await ai_sicknessService.create({ name: sickness });
        //             addedSicknessArray[aiSicknessCreated.id] = aiSicknessCreated.name;
        //             await processAndCreateSymptoms(aiSicknessCreated);
        //         }

        //         const sicknessId = addedSicknessArray.indexOf(sickness);

        //         const recordExisted = await AiRecordSicknessModel.findOne({ where: { ai_record_id: record.id, aiSicknessId: sicknessId } });
        //         if (!recordExisted) {
        //             await AiRecordSicknessModel.create({ ai_record_id: record.id, aiSicknessId: sicknessId });
        //         }
        //     }

        //     const medicineArray = extractDrugInfo(drug.medicines);
        //     for (let medicine of medicineArray) {
        //         const medicineName = medicine.name.trim();
        //         if (!addedMedicineArray.includes(medicineName)) {
        //             let aiMedicineCreated = await AiMedicineService.create(medicine);
        //             addedMedicineArray[aiMedicineCreated.id] = aiMedicineCreated.name;
        //         }
        //         const medicineId = addedMedicineArray.indexOf(medicineName);
        //         await AiRecordMedicineModel.create({
        //             ai_record_id: record.id,
        //             aiMedicineId: medicineId,
        //             unit: medicine.unit,
        //             price: medicine.price,
        //             dosage: medicine.dosage
        //         });
        //     }
        // }
        let addedSicknessArray = [];
        let addedMedicineArray = [];

        await sequelize.transaction(async (transaction) => {
            for (const drug of data) {
                const record = await AiRecordModel.create({}, { transaction });

                const sicknessArray = drug.sicknesses.split(';').map(item => item.trim());
                for (let sickness of sicknessArray) {
                    sickness = sickness.trim();
                    if (!addedSicknessArray.includes(sickness)) {
                        let aiSicknessCreated = await ai_sicknessService.create({ name: sickness }, { transaction });
                        addedSicknessArray[aiSicknessCreated.id] = aiSicknessCreated.name;
                        await processAndCreateSymptoms(aiSicknessCreated, transaction);
                    }

                    const sicknessId = addedSicknessArray.indexOf(sickness);

                    const recordExisted = await AiRecordSicknessModel.findOne({ where: { ai_record_id: record.id, aiSicknessId: sicknessId }, transaction });
                    if (!recordExisted) {
                        await AiRecordSicknessModel.create({ ai_record_id: record.id, aiSicknessId: sicknessId }, { transaction });
                    }
                }

                const medicineArray = extractDrugInfo(drug.medicines);
                for (let medicine of medicineArray) {
                    const medicineName = medicine.name.trim();
                    if (!addedMedicineArray.includes(medicineName)) {
                        let aiMedicineCreated = await AiMedicineService.create(medicine, { transaction });
                        addedMedicineArray[aiMedicineCreated.id] = aiMedicineCreated.name;
                    }
                    const medicineId = addedMedicineArray.indexOf(medicineName);

                    const medicineRecordExisted = await AiRecordMedicineModel.findOne({ where: { ai_record_id: record.id, aiMedicineId: medicineId }, transaction });
                    if (!medicineRecordExisted) {
                        await AiRecordMedicineModel.create({
                            ai_record_id: record.id,
                            aiMedicineId: medicineId,
                            unit: medicine.unit,
                            price: medicine.price,
                            dosage: medicine.dosage
                        }, { transaction });
                    }
                }
            }
        });



        // let sicknessArray = await Promise.all(data.map(async (item) => {
        //     const array = item.sicknesses.split(';').map(item => item.trim());
        //     return array
        // }))
        // sicknessArray = [...new Set(sicknessArray.flatMap(item => item).filter(item => item !== ''))]
        // Promise.all(sicknessArray.map(async (sickness) => {
        //     sickness = sickness.trim();
        //     const sicknessExist = await ai_sicknessService.findSicknessByName(sickness);
        //     if (!sicknessExist) {
        //         await ai_sicknessService.create({ name: sickness })
        //     }
        // }))
        // await processAndCreateSymptoms(sicknessArray)

        // // -------------------PHẦN THUỐC--------------------


        // let medicineArray = await Promise.all(data.map(async (item, index) => {
        //     let array = extractDrugInfo(item.medicines);
        //     return array;
        // }));

        // medicineArray = medicineArray.flatMap(item => item);
        // medicineArray = removeDuplicatesByName(medicineArray);

        // await Promise.all(medicineArray.map(async (drug) => {
        //     let drugName = drug.name.trim();
        //     const drugsExist = await AiMedicineService.findMedicineByName(drugName);
        //     if (!drugsExist) {
        //         console.log(drugsExist);
        //         await AiMedicineService.create(drug);
        //     }
        // }));

        // -----------------PHẦN RECORD--------------------
        // await Promise.all(data.map(async (drug) => {
        //     const record = await AiRecordModel.create({});

        //     const sicknessArray = drug.sicknesses.split(';').map(item => item.trim());
        //     await Promise.all(sicknessArray.map(async (sickness) => {
        //         sickness = sickness.trim();
        //         const sicknessFromDB = await ai_sicknessService.findSicknessByName(sickness);
        //         const recordExisted = await AiRecordSicknessModel.findOne({ where: { ai_record_id: record.id, aiSicknessId: sicknessFromDB.id } });
        //         if (!recordExisted) {
        //             await AiRecordSicknessModel.create({ ai_record_id: record.id, aiSicknessId: sicknessFromDB.id });
        //         }
        //     }));

        //     const medicineArray = extractDrugInfo(drug.medicines);
        //     await Promise.all(medicineArray.map(async (medicine) => {
        //         console.log(medicine);
        //         const medicineName = medicine.name.trim();
        //         const medicineFromDB = await ai_medicineService.findMedicineByName(medicineName);
        //         const recordExisted = await AiRecordMedicineModel.findOne({ where: { ai_record_id: record.id, aiMedicineId: medicineFromDB.id, unit: medicine.unit, price: medicine.price, dosage: medicine.dosage } });
        //         if (!recordExisted) {
        //             await AiRecordMedicineModel.create({ ai_record_id: record.id, aiMedicineId: medicineFromDB.id, unit: medicine.unit, price: medicine.price, dosage: medicine.dosage });
        //         }
        //     }));
        // }));

        res.status(200).json({ data: 1 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
