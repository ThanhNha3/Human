const { where } = require("sequelize");
const { PrescriptionModel } = require("../models");
const medicineService = require("../services/medicine.service");
const prescriptionMedicineService = require("../services/prescription-medicine.service");
const PresriptionMedicineService = require("../services/prescription-medicine.service");
const prescriptionService = require("../services/prescription.service");
const sicknessService = require("../services/sickness.service");
const userService = require("../services/user.service");

class PrescriptionMedicineController {
    constructor() {
        this.findAll = this.findAll.bind(this);
        this.findByPrescriptionId = this.findByPrescriptionId.bind(this);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    async create(req, res) {
        try {
            const data = await PresriptionMedicineService.create(req)
            res.status(201).json({
                data
            })
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
    async findAll(req, res) {
        try {
            const data = await PresriptionMedicineService.findAll();
            // Lấy ra các prescription id không trùng nhau
            let prescriptionIdArray = data.map((item) => {
                return item.prescriptionId
            })
            prescriptionIdArray = Array.from(new Set(prescriptionIdArray));

            // Lấy ra thông tin các user có prescription đã accepted có thể trùng nhau
            const users = await Promise.all(prescriptionIdArray.map(async (prescriptionId) => {
                const prescription = await PrescriptionModel.findOne({ where: { id: prescriptionId } });
                const user = await userService.findById(prescription.created_by)
                return user
            }))

            // Lấy ra sickness theo prescription id
            const sickness = await Promise.all(prescriptionIdArray.map(async (prescriptionId) => {
                return await sicknessService.findByPrescriptionId(prescriptionId)
            }))

            // Check xem đã bốc chưa


            const finalData = await Promise.all(users.map(async (user, index) => {
                let sickness = await sicknessService.findByPrescriptionId(prescriptionIdArray[index]);
                const prescriptionMedicines = await prescriptionMedicineService.findAllByStatus(prescriptionIdArray[index])
                const pharmartistHanded = prescriptionMedicines.filter((prescriptionMedicine) => prescriptionMedicine.status === "accepted");
                const prescription = await prescriptionService.findById(prescriptionIdArray[index]);
                sickness = sickness.map((sick) => {
                    return {
                        id: sick.id,
                        name: sick.name,
                    }
                })
                return {
                    user: {
                        id: user.id,
                        fullname: user.fullname,
                        phone: user.phone,
                        age: user.age,
                    },
                    prescriptionId: prescriptionIdArray[index],
                    created_at: this.formatDate(prescription.createdAt),
                    sickness,
                    isAccepted: pharmartistHanded.length > 0 ? true : false,
                    isHanded: prescription.status === "accepted" ? true : false
                }
            }))
            res.status(201).json({
                data: finalData
            })
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
    async findByPrescriptionId(req, res) {
        try {
            const { user_id, id } = req.params
            // Lấy ra danh sách đơn thuốc theo id
            let prescriptionsMedicines = await PresriptionMedicineService.findByPrescriptionId(id)
            // Lấy ra thông tin đơn thuốc theo id
            const prescription = await prescriptionService.findByIdAndUserId(id, user_id)
            // Lấy ra thông tin user theo id
            const user = await userService.findById(user_id)
            // Lấy ra thông tin thuốc theo id
            prescriptionsMedicines = await Promise.all(prescriptionsMedicines.map(async (prescriptionsMedicine) => {
                const medicineFromDB = await medicineService.findById(prescriptionsMedicine.medicineId)
                return {
                    name: medicineFromDB.name,
                    unit: medicineFromDB.unit,
                    quantity: prescriptionsMedicine.quantity,
                    price: medicineFromDB.price,
                    dosage: prescriptionsMedicine.dosage,
                }
            }))
            let sickness = await sicknessService.findByPrescriptionId(prescription.id)
            sickness = sickness.map((sick) => {
                return {
                    name: sick.name
                }
            })
            const doctor = await userService.findById(prescription.accepted_by);

            const prescriptionMedicines = await prescriptionMedicineService.findByPrescriptionId(id)
            const pharmartistHanded = prescriptionMedicines.filter((prescriptionMedicine) => prescriptionMedicine.status === "accepted");

            res.status(201).json({
                isAccepted: pharmartistHanded.length > 0 ? true : false,
                isHanded: prescription.status === "accepted" ? true : false,
                prescription: {
                    id: prescription.id,
                },
                user: {
                    fullname: user.fullname,
                    phone: user.phone,
                    age: user.age,
                    email: user.email,
                    gender: user.gender
                },
                sickness,
                symptoms: prescription.symptoms,
                underlying_condition: prescription.underlying_condition,
                note: prescription.note,
                medicines: prescriptionsMedicines,
                created_at: this.formatDate(prescription.createdAt),
                doctor: {
                    id: doctor.id,
                    fullname: doctor.fullname,
                    phone: doctor.phone,
                }
            })
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
    async removeMedicineById(req, res) {
        try {
            await PresriptionMedicineService.removeMedicineById(req)
            res.status(201).json({
                message: "Xóa thuốc thành công"
            })
        } catch (error) {
            res.status(500).send(error.message)
        }

    }
    async editByPrescriptionId(req, res) {
        try {
            await PresriptionMedicineService.editByPrescriptionId(req)
            res.status(201).json({
                message: "Sửa đơn thuốc thành công"
            })
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
    async confirmedPrescriptionMedicine(req, res) {
        try {
            await PresriptionMedicineService.confirmedPrescriptionMedicine(req)
            res.status(201).json({
                message: "Xác nhận đơn thuốc thành công"
            })
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
    async acceptedPrescriptionMedicine(req, res) {
        try {
            await PresriptionMedicineService.acceptedPrescriptionMedicine(req)
            res.status(201).json({
                message: "Chấp nhận đơn thuốc thành công"
            })
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
    async findById(req, res) {
        try {
            const data = await PresriptionMedicineService.findById(req)
            res.status(201).json({
                data
            })
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
    async findAllPrescriptionMedicineByPrescriptionId(req, res) {
        try {
            const data = await PresriptionMedicineService.findAllPrescriptionMedicineByPrescriptionId(req)
            res.status(201).json({
                data
            })
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
}
module.exports = new PrescriptionMedicineController()

