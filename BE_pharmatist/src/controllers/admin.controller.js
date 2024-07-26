const adminService = require("../services/admin.service");

class AdminController {
    async findMostSicknessByAgeGroup(req, res) {
        try {
            const data = await adminService.findMostSicknessByAgeGroup();
            res.status(201).json({ data });
        } catch (error) {
            res.send({ data: [] })
        }
    }
    async findUserByAgeGroup(req, res) {
        try {
            const data = await adminService.findUserByAgeGroup();
            res.status(201).json({ data });
        } catch (error) {
            res.send({ data: [] })
        }
    }
    async getAverageVisitByAgeGroup(req, res) {
        try {
            const data = await adminService.getAverageVisitByAgeGroup();
            res.status(201).json({ data });
        } catch (error) {
            res.send({ data: [] })
        }
    }
}
module.exports = new AdminController();