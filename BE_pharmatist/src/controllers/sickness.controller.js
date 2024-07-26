const sicknessService = require("../services/sickness.service");

class SicknessController {
    async create(req, res) {
        try {
            const data = await sicknessService.create(req.body)
            res.status(201).json({
                data
            })
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
    async edit(req, res) {
        try {
            const id = req.params.id
            await sicknessService.edit(id,req.body)
            res.status(201).json({
                message: "Sửa bệnh thành công"
            })
        } catch (error) {
            res.status(500).send(error.message)
        }
    }

}
module.exports = new SicknessController()