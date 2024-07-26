const AiSymptomModel = require("../models/ai_symptoms.model");
const SicknessModel = require("../models/sickness.model");
const ai_record_medicineService = require("../services/ai_record_medicine.service");
const ai_sicknessService = require("../services/ai_sickness.service");
const allergicService = require("../services/allergic.service");
const geminiService = require("../services/gemini.service");
const langchainService = require("../services/langchain.service");
const medicineService = require("../services/medicine.service");
const prescriptionMedicineService = require("../services/prescription-medicine.service");
const prescriptionService = require("../services/prescription.service");
const sicknessMedicineService = require("../services/sickness-medicine.service");
const sicknessService = require("../services/sickness.service");
const userService = require("../services/user.service");

class PrescriptionController {
  constructor() {
    this.findById = this.findById.bind(this);
    this.findAll = this.findAll.bind(this);
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  async findAll(req, res) {
    try {
      if (req.query.id) {
        const prescription =
          await prescriptionService.findAllByDoctorAndPharmartist(req);
        const user = await userService.findById(prescription[0].created_by);
        const sickness = await sicknessService.findById(req.query.id);
        const prescriptionMedicines =
          await prescriptionMedicineService.findByPrescriptionId(
            prescription[0].id
          );
        const pharmartistHanded = prescriptionMedicines.filter(
          (prescriptionMedicine) => prescriptionMedicine.status === "accepted"
        );
        const data = {
          user: {
            id: user.id,
            fullname: user.fullname,
            phone: user.phone,
          },
          prescriptionId: req.query.id,
          created_at: this.formatDate(prescription[0].createdAt),
          sickness: sickness[0],
          isAccepted: pharmartistHanded.length > 0 ? true : false,
          isHanded: prescription[0].status === "accepted" ? true : false,
        };
        res.status(200).json({
          data,
        });
      } else {
        const prescriptions = await prescriptionService.findAll(req);
        const data = await Promise.all(
          prescriptions.map(async (prescription) => {
            const user = await userService.findById(prescription.created_by);
            if (!user) {
              console.error(`Không tìm thấy người dùng với ID: ${prescription.created_by}`);
              return null;
            }
            const sickness = await sicknessService.findById(prescription.id);
            if (!sickness || sickness.length === 0) {
              console.error(`Không tìm thấy bệnh với ID: ${prescription.id}`);
              return null;
            }
            return {
              user_id: user.id,
              fullname: user.fullname,
              phone: user.phone,
              address: user.address,
              id: prescription.id,
              symptoms: prescription.symptoms,
              sickness: sickness[0],
            };
          })
        );
        res.status(200).json({
          data: data.filter(item => item !== null), // Loại bỏ các giá trị null
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error.message);
    }
  }
  async create(req, res) {
    try {
      const data = await prescriptionService.create(req.body);
      res.status(201).json({
        data,
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
  async edit(req, res) {
    try {
      await prescriptionService.edit(req);
      res.status(201).json({
        message: "Sửa đơn thuốc thành công",
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
  async sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  async findById(req, res) {
    try {
      const prescriptionId = req.params.id;
      const prescription = await prescriptionService.findById(prescriptionId);
      let userId = prescription.created_by;
      const user = await userService.findById(userId);
      const allergics = await allergicService.findByPrescriptionId(
        prescription.id
      );
      const sickness = await sicknessService.findById(prescription.id);
      const prescription_medicines =
        await prescriptionMedicineService.findByPrescriptionId(prescriptionId);
      const medicines = await Promise.all(
        prescription_medicines.map(async (item) => {
          const medicine = await medicineService.findById(item.medicineId);
          return {
            id: medicine.id,
            image: medicine.image,
            unit: medicine.unit,
            name: medicine.name,
            quantity: item.quantity,
            dosage: item.dosage,
            price: medicine.price,
          };
        })
      );

      const prescriptionMedicines =
        await prescriptionMedicineService.findByPrescriptionId(prescription.id);
      const pharmartistHanded = prescriptionMedicines.filter(
        (prescriptionMedicine) => prescriptionMedicine.status === "accepted"
      );
      let userAllergics = await allergicService.getByUserIdAndPrescriptionId(
        user.id,
        prescription.id
      );
      userAllergics = userAllergics.map((item) => {
        return {
          id: item.id,
          name: item.name,
        };
      });
      // Phần triệu chứng chuyên nghành do Nhả làm
      const symptoms = prescription.symptoms;
      const allSymptomsFromDBAI = await AiSymptomModel.findAll();
      let specializedSymptoms = await langchainService.create(symptoms, allSymptomsFromDBAI)
      console.log("specializedSymptoms", specializedSymptoms);
      specializedSymptoms = specializedSymptoms.split(',').map(symptom => symptom.trim());
      // Kết thúc phần triệu chứng chuyên nghành
      let data = {
        specializedSymptoms,
        prescription,
        created_at: this.formatDate(prescription.createdAt),
        user: {
          id: user.id,
          fullname: user.fullname,
          phone: user.phone,
          gender: user.gender,
          age: user.age,
        },
        userAllergics,
        sickness,
        isAccepted: pharmartistHanded.length > 0 ? true : false,
        isHanded: prescription.status === "accepted" ? true : false,
        allergics,
        sickness,
        medicines,
      };
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
  async getAllPrescriptionByUserId(req, res) {
    try {
      const data = await prescriptionService.getAllPrescriptionByUserId(req);
      res.status(201).json({
        data,
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
  async editPrescriptionById(req, res) {
    try {
      const data = await prescriptionService.update(req);
      res.status(201).json({
        data,
      });
    } catch (error) {
      return error;
    }
  }
  async createSickness(req, res) {
    try {
      const prescription_id = req.params.id;
      const { name, order, department } = req.body;
      const sickness = await sicknessService.create({
        prescription_id,
        name,
        order,
        department,
      });
      if (sickness) {
        return res.status(200).json({ message: "Create sickness success" });
      }
      res.status(400).json({ message: "Create sickness fail" });
    } catch (error) { }
  }
  async updateSicknessOrder(req, res) {
    try {
      const prescription_id = req.params.id;
      const { id, order } = req.body;
      let data = await SicknessModel.findAll({ where: { prescription_id } });
      let targetSickness = data.find((item) => item.id == id);
      if (!targetSickness)
        return res.status(404).json({ message: "Sickness not found" });

      let affectedSickness = data.find(
        (item) => item.order == order && item.id !== id
      );
      let newOrder = Number(order);

      if (affectedSickness) {
        await SicknessModel.update(
          { order: targetSickness.order },
          { where: { id: affectedSickness.id } }
        );
      }
      let isUpdated = await SicknessModel.update(
        { order: newOrder },
        { where: { id } }
      );
      if (isUpdated) {
        let newData = await SicknessModel.findAll({
          where: { prescription_id },
        });
        newData.sort((a, b) => a.order - b.order);
        return res.status(200).json({
          message: "Update sickness order success",
          data: newData,
        });
      }
      res.status(400).json({ message: "Update sickness order fail" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "An error occurred" });
    }
  }
  async deleteSickness(req, res) {
    try {
      const { prescription_id, id } = req.params;
      const sickness = await sicknessService.delete({ prescription_id, id });
      if (sickness) {
        return res.status(200).json({ message: "Delete sickness success" });
      }
      res.status(400).json({ message: "Delete sickness fail" });
    } catch (error) { }
  }
  async deleteByPrescriptionId(req, res) {
    try {
      const data = await prescriptionService.deleteByPrescriptionId(req);
      res.status(201).json({
        data: "Xóa đơn thuốc thành công",
      });
    } catch (error) {
      return error;
    }
  }
  async getAllSicknessByPrescriptionId(req, res) {
    try {
      const data = await sicknessService.getAllSicknessByPrescriptionId(req);
      res.status(201).json({
        data,
      });
    } catch (error) {
      return error;
    }
  }
}
module.exports = new PrescriptionController();
