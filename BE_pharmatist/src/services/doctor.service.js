const DoctorModel = require("../models/doctor");

class DoctorService {
    async create(req) {
        try {
            const user = await DoctorModel.create(req)
            return user
        } catch (error) {
            return error
        }
    }
    async findByPhone(phone) {
        try {
            return await DoctorModel.findOne({ where: { phone: phone } })
        } catch (error) {
            return error;
        }
    }
    async findById(id) {
        try {
            return await DoctorModel.findByPk(id)
        } catch (error) {
            return error
        }
    }
    async update(data, id) {
        try {
            return await DoctorModel.update(data, { where: { id } })
        } catch (error) {
            return error
        }
    }
}
module.exports = new DoctorService()