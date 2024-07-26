const DepartmentModel = require("../models/department")

class DepartmentController {
    async getAllDepartment(req, res) {
        try {
            const data = await DepartmentModel.findAll()
            return res.status(200).json({ data })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}
module.exports = new DepartmentController()