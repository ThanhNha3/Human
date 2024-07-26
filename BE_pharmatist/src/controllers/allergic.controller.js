const UserAllergicModel = require("../models/user-allergic.model")
const allergicService = require("../services/allergic.service")

class AllergicController {
    async create(req, res) {
        try {
            const { user_id, prescription_id } = req.body
            if (!user_id || !prescription_id) {
                return res.status(400).json({ message: 'Vui lòng nhập ID người dùng hoặc ID đơn khám' })
            }
            const data = await allergicService.create(req.body)
            return res.status(200).json({ data })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    async update(req, res) {
        try {
            const data = await allergicService.update(req)
            return res.status(200).json({ data })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    async delete(req, res) {
        try {
            const data = await allergicService.delete(req)
            return res.status(200).json({ data })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    async updateByUserIdAndPrescriptionIdAndName(req, res) {
        try {
            const { user_id, id } = req.params
            const { name } = req.query
            const data = await allergicService.updateByUserIdAndPrescriptionIdAndName(user_id, id, name, req)
            return res.status(200).json({ data })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    async findByPrescriptionIdAndName(req, res) {
        try {
            const { user_id, prescription_id } = req.params
            const data = await allergicService.getByUserIdAndPrescriptionId(user_id, prescription_id, req.query.name)
            return res.status(200).json({ data })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    async deleteAll(req, res) {
        try {
            const data = await allergicService.deleteAll(req)
            return res.status(200).json({ data })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}
module.exports = new AllergicController()