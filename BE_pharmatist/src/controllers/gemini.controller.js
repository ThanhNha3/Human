const { UserModel } = require("../models");
const AiSymptomModel = require("../models/ai_symptoms.model");
const SicknessModel = require("../models/sickness.model");
const UserAllergicModel = require("../models/user-allergic.model");
const allergicService = require("../services/allergic.service");
const geminiService = require("../services/gemini.service");
const medicineService = require("../services/medicine.service");
const prescriptionMedicineService = require("../services/prescription-medicine.service");
const prescriptionService = require("../services/prescription.service");
const sicknessMedicineService = require("../services/sickness-medicine.service");
const sicknessService = require("../services/sickness.service");
const sequelize = require("../config/db");
const AiSicknessSymptomModel = require("../models/ai_sickness_symptom.model");
const AiSicknessModel = require("../models/ai_sickness.model");
const ai_symptomService = require("../services/ai_symptom.service");
const ai_sickness_symptomService = require("../services/ai_sickness_symptom.service");
const ai_record_medicineService = require("../services/ai_record_medicine.service");
const langchainService = require("../services/langchain.service");
const { Op } = require("sequelize");

// chat.controller.js
class GeminiController {
  async hashInfo(req, res, next) {
    try {
      const systemInstruction = `Bạn là một công cụ để chuyển văn bản thành JSON. Khi tôi gửi dòng chat tiếp theo, hãy phân tích dòng chat đó và lấy ra các thông tin sau vào phần JSON:
            - "fullname": Tên của tôi
            - "age": Tuổi của tôi
            - "gender": Giới tính của tôi
            - "phone": Địa chỉ của tôi
            - "symptom": Các triệu chứng của tôi
            - "underlying condition": Các bệnh nền của tôi

            Nếu bạn không thể phân tích bất kỳ thông tin nào, hãy trả ra giá trị là null

            Ví dụ của phần JSON mà bạn cần trả ra:
            {
            "fullname": "Huỳnh Quang Tiên",
            "age": 23,
            "gender": "nam",
            "phone": "0946630197",
            "symptom": "đau đầu chóng mặt và buồn nôn",
            "underlying_condition": "từng bị tiền đình",
            "allergic": ["paracetamol", "aspirin"]
            }
            Bạn chỉ đưa ra phần JSON, không có định dạng`;
      let data = await geminiService.run(req.body.message, systemInstruction);
      data = JSON.parse(data);
      // Check if phone number exists in the data
      if (data.phone) {
        // Query your database for a record with this phone number
        const existingRecord = await UserModel.findOne({
          where: { phone: data.phone },
        });

        // If a record exists, update the data object with personal information from the database
        if (existingRecord) {
          data.fullname = existingRecord.fullname || data.fullname;
          data.age = existingRecord.age || data.age;
          data.gender = existingRecord.gender || data.gender;
          // data.underlying_condition =
          //   existingRecord.underlying_condition || data.underlying_condition;
          // Keep symptoms, underlying conditions, and allergies as is
        }
      }
      res.send(data);
    } catch (error) {
      console.log("hash infor error", error);
      const dataError = {
        fullname: null,
        age: null,
        gender: null,
        phone: null,
        symptom: null,
        underlying_condition: null,
        allergic: [],
      };
      res.send(dataError);
    }
  }

  // Nhiệm vụ 1: Tạo chuẩn đoán
  async generateDiagnose(req, res, next) {
    try {
      const systemInstruction = `Bạn là một nhân viên tiếp nhận y tế, và bạn đang tiếp nhận hồ sơ bệnh án.
Nhiệm vụ của bạn là dựa trên những dữ liệu dưới đây:
Mảng dữ liệu triệu chứng của bệnh nhân cung cấp: {userSymptoms}.
Mảng dữ liệu triệu chứng từ database: {symptomsAIDb}.
Mảng dữ liệu chẩn đoán từ database: {sicknessAIDb}.
Hãy phân tích và đưa ra dữ liệu các chẩn đoán có các trường sau đây:
"name": tên bệnh được chẩn đoán.
"probability": xác suất bệnh đó
"department": khoa chuyên trách
Ví dụ của dữ liệu mà bạn nên trả về, bạn hoàn toàn có thể trả nhiều kết quả dù là tỉ lệ nhỏ nhất và phù hợp với biểu hiện của người bệnh, lưu ý bạn nên trả về ngôn ngữ tiếng Việt
[
  {
    "name": "Ho lao",
    "probability": 0.6,
    "department": "Nội tiết",
  },
  {
    "name": "Sốt rét",
    "probability": 0.3,
    "department": "Nội tiết"
  },
  {
    "name": "Viêm phổi",
    "probability": 0.1,
    "department": "Nội tiết"
  }
]
Lưu ý: 
- Tên bệnh phải sử dụng thuật ngữ y khoa chính xác và dịch thuật từ các tài liệu y khoa uy tín, không lấy từ báo chí.
- Bạn có thể đưa ra các chẩn đoán khác ngoài mảng dữ liệu chẩn đoán từ database. 
- Bạn chỉ cần đưa ra phần mảng JSON không cần chú thích, không cần định dạng văn bản
- Tổng probability của các đối tượng phải bằng 1

`;
      // Triệu chứng bệnh nhân cung cấp
      const userInputSymptoms = req.body.symptoms;
      const userSymptoms = userInputSymptoms
        .split(",")
        .map((symptom) => symptom.trim());
      // Lấy ra các triệu chứng từ DB AI
      const symptomsAIDb = (
        await Promise.all(
          userSymptoms.map(async (userSymptom) => {
            const result = await ai_symptomService.findLikeName(userSymptom);
            return result;
          })
        )
      )
        .flat()
        .filter((symptomsAIDb) => symptomsAIDb !== null);
      // lấy các chẩn đoán từ DB AI

      // Phần này Nhả thêm vào để lấy triệu chứng chuyên nghành
      const allSymptomsFromDBAI = await AiSymptomModel.findAll();
      let specializedSymptoms = await langchainService.create(
        userSymptoms,
        allSymptomsFromDBAI
      );
      specializedSymptoms = specializedSymptoms
        .split(",")
        .map((symptom) => symptom.trim());
      console.log("specializedSymptoms", specializedSymptoms);
      // Kết thúc phần Nhả làm này
      console.log("symptomsAIDb", symptomsAIDb);

      const diagnosisAIDb = (
        await Promise.all(
          symptomsAIDb.map(async (symptom) => {
            return await ai_sickness_symptomService.findAllById(symptom.id);
          })
        )
      ).flat();
      console.log("diagnosisAIDb", diagnosisAIDb);
      console.log("diagnosisAIDb length", diagnosisAIDb.length);
      const sicknessAIDb = await Promise.all(
        diagnosisAIDb.map(async (item) => {
          const symptom = await AiSicknessModel.findOne({
            where: { id: item.ai_sicknesses_id },
          });
          return symptom;
        })
      );
      console.log("sicknessAIDb", sicknessAIDb);
      console.log("typeof sicknessAIDb", Array.isArray(sicknessAIDb));
      // Tạo mảng chứa tên các triệu chứng
      // const symptomNameArrayAIDb = [...new Set(symptomsAIDb.map(item => item.name))]
      // Tạo mảng chứa tên chẩn đoán
      const sicknessNameArrayAIDb = [
        ...new Set(
          sicknessAIDb.map((item) => {
            if (item !== null && item.name) {
              return item.name;
            }
            return "";
          })
        ),
      ];

      const input = {
        userSymptoms,
        symptomsAIDb: specializedSymptoms,
        sicknessAIDb: sicknessNameArrayAIDb,
        underlying_condition: req.body.underlying_condition,
      };

      const inputString = JSON.stringify(input);
      const data = await geminiService.run(inputString, systemInstruction);

      // Tạo prescription ==> prescription_id chứa underlyings, symptoms, diagnosis
      const newPrescription = {
        created_by: req.body.created_by,
        underlying_condition: req.body.underlying_condition,
        symptoms: req.body.symptoms,
      };
      // Lấy ra prescription vừa tạo
      const prescription = await prescriptionService.create(newPrescription);
      const allergics = await allergicService.findByUserId(req.body.created_by);
      allergics.map(async (allergic) => {
        await UserAllergicModel.update(
          {
            prescription_id: prescription.id,
          },
          { where: { id: allergic.id } }
        );
      });
      // Lấy ra từng sickness
      const array = JSON.parse(data);
      array.sort((a, b) => b.probability - a.probability);
      array.map(async (item, index) => {
        await sicknessService.create({
          prescription_id: prescription.dataValues.id,
          name: item.name,
          department: item.department,
          probability: item.probability,
          order: index + 1,
        });
      });
      res.send({
        userSymptoms,
        symptomsAIDb: specializedSymptoms,
        sicknessAIDb: sicknessNameArrayAIDb,
        data: JSON.parse(data),
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred");
    }
  }

  // Nhiệm vụ 2: Tạo thuốc
  async generateMedicine(req, res, next) {
    try {
      const systemInstruction = `Bạn là một bác sĩ, và bạn đang khám trực tiếp với bệnh nhân.
tôi sẽ cung cấp một đối tượng JSON gồm các trường sau:
sickness: các bệnh mà bệnh nhân đang mắc phải
medicines: các loại thuốc
allergics: thành phần dị ứng

Nhiệm vụ của bạn là: hãy phân tích đối tượng đó, dựa vào trường sickness và allergics để đưa ra loại thuốc phù hợp mà bạn tìm được (tài liệu bạn tìm nên đến từ các tài liệu báo chí khoa học liên quan đến y tế), cùng với đó hãy kết hợp với trường medicines và xem đâu là những loại thuốc phù hợp với các bệnh mà bệnh nhân đang mắc phải, nếu bệnh nhân bị dị ứng với allergics thì bạn hãy lọc loại thuốc đó cũng như những thông tin của loại thuốc đó, hãy phân tích và trả về dữ liệu dạng mảng JSON chứa các trường sau đây:
- "name": tên thuốc
- "quantity": số lượng thuốc
- "unit": đơn vị thuốc như lọ, chai, viên, vỉ, hộp
- "dosage": cách dùng và liều lượng sử dụng thuốc/lần, tổng liều lượng/ngày
- "price": giá của thuốc bằng quantity nhân với unit (cụ thể là 1 chai, 1 lọ,1 viên,... tùy theo đơn vị của thuốc), nếu bạn không tìm thấy giá tiền thì hãy tự tìm dữ liệu trên Internet và hiện ra con số phù hợp

Nếu bạn không thể phân tích bất kỳ thông tin nào, hãy trả ra giá trị là null

Ví dụ của chuỗi JSON mà bạn nên trả về, bạn hoàn toàn có thể trả nhiều hoặc 
ít kết quả miễn sao phù hợp với bệnh được cung cấp, lưu ý bạn nên trả về ngôn ngữ tiếng Việt

  [
    {
      "name": "Paracetamol",
      "quantity": 10,
      "unit": "chai",
      "dosage": "uống 1 viên/lần, 2 lần/ngày",
      "price": 10000
    },
    {
      "name": "Aspirin",
      "quantity": 10,
      "unit": "viên",
      "dosage": "uống 1 viên/lần, 2 lần/ngày",
      "price": 5000
    },
    {
      "name": "Salbutamol",
      "quantity": 1,
      "unit": "lọ xịt",
      "dosage": "Xịt 2 nhát/lần, 4 lần/ngày",
      "price": 30000
    }
  ]

Lưu ý: Bạn chỉ cần đưa ra phần mảng JSON không cần chú thích, không cần định dạng văn bản`;
      const allergies = await UserAllergicModel.findAll({
        user_id: req.body.user_id,
      });
      // Code mới
      const sicknessArray = req.body.message.split(",");
      const sicknessArrayIds = await Promise.all(
        sicknessArray.map(async (iterator) => {
          iterator = iterator.trim();
          const sickness = await sicknessService.findSicknessByName(iterator);
          if (!sickness) {
            const sicknessCreated = await sicknessService.create({
              name: iterator,
            });
            return sicknessCreated.id;
          }
          return sickness.id;
        })
      );
      const medicinesArray =
        await ai_record_medicineService.findMedicineBySickness(
          sicknessArrayIds
        );
      const uniqueObjects = [];
      medicinesArray.forEach((obj) => {
        // Kiểm tra xem tên của đối tượng hiện tại đã có trong mảng uniqueObjects chưa
        if (
          !uniqueObjects.some(
            (uniqueObj) => uniqueObj.medicines === obj.medicines
          )
        ) {
          // Nếu chưa có, thêm đối tượng hiện tại vào mảng uniqueObjects
          uniqueObjects.push(obj);
        }
      });

      const objectData = {
        sickness: req.body.message,
        medicines: uniqueObjects,
        allergics: allergies,
      };

      // Code cũ
      const data = await geminiService.run(
        JSON.stringify(objectData),
        systemInstruction
      );
      const medicines = JSON.parse(data);
      if (medicines.length > 0) {
        for (const medicine of medicines) {
          const newMedicine = {
            name: medicine.name,
            unit: medicine.unit,
            price: medicine.price,
          };
          const medicineExisted = await medicineService.findByName(medicine);
          if (!medicineExisted) {
            await medicineService.create(newMedicine);
          } else {
            await medicineService.update(medicine, medicine.name);
          }
          const medicineA = await medicineService.findByName(medicine);
          await prescriptionMedicineService.create({
            prescriptionId: Number(req.body.prescriptionId),
            quantity: medicine.quantity,
            dosage: medicine.dosage,
            medicineId: medicineA.id,
          });
        }
      }
      res.send(data);
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred");
    }
  }
}

module.exports = new GeminiController();
