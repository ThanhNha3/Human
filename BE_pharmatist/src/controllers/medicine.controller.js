const medicineService = require("../services/medicine.service");

class MedicineController {
    async create(req, res) {
        try {
            await medicineService.create(req.body)
            res.status(201).json({
                message: "Tạo đơn thuốc thành công"
            })
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
    async findByName(req, res) {
        try {
            const medicine = await medicineService.findByName(req)
            res.status(201).json({
                medicine
            })
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
    async findAll(req, res) {
        try {
            const medicine = await medicineService.findAll(req.query)
            res.status(200).json({
                medicine
            })
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
    async findMedicineByName(req, res) {
        try {
            const medicine = await medicineService.findMedicineByName(req.query.name)
            res.status(200).json({
                medicine
            })
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
}
module.exports = new MedicineController()