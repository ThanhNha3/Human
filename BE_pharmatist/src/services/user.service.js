const { UserModel } = require("../models/index")

class UserService {
    async create(req) {
        try {
            const user = await UserModel.create(req)
            return user
        } catch (error) {
            return error
        }
    }
    async findByPhone(phone) {
        try {
            return await UserModel.findOne({ where: { phone: phone } })
        } catch (error) {
            return error;
        }
    }
    async findById(id) {
        try {
            return await UserModel.findByPk(id)
        } catch (error) {
            return error
        }
    }
    async update(data, id) {
        try {
            return await UserModel.update(data, { where: { id } })
        } catch (error) {
            return error
        }
    }
}
module.exports = new UserService()