const UserAllergicModel = require("../models/user-allergic.model")

class AllergicService {
    async findByPrescriptionId(prescription_id){
        try {
            return await UserAllergicModel.findAll({ where: { prescription_id } })
        } catch (error) {
            return error
        }
    }
    async findByUserId(user_id){
        try {
            return await UserAllergicModel.findAll({ where: { user_id } })
        } catch (error) {
            return error
        }
    }
    async create(req) {
        try {
            return await UserAllergicModel.create(req)
        } catch (error) {
            return error
        }
    }
    async update(req) {
        try {
            const { user_id, id, name } = req.body
            return await UserAllergicModel.update({ name }, { where: { id: id, user_id } })
        } catch (error) {
            return error
        }
    }
    async delete(req) {
        try {
            const { user_id, id } = req.params
            return await UserAllergicModel.destroy({ where: { id, user_id } })
        } catch (error) {
            return error
        }
    }
    async getByUserIdAndPrescriptionId(user_id, prescription_id, name) {
        try {
            if (name) {
                return await UserAllergicModel.findAll({ where: { user_id, prescription_id, name } })
            }
            return await UserAllergicModel.findAll({ where: { user_id, prescription_id } })
        } catch (error) {
            return error
        }
    }

    async updateByUserIdAndPrescriptionIdAndName(user_id, prescription_id, currentName, req) {
        try {
            const { name } = req.body
            return await UserAllergicModel.update({ name }, { where: { user_id, prescription_id, name: currentName } })
        } catch (error) {
            return error
        }
    }
    async deleteAll(req) {
        try {
            const { user_id, prescription_id } = req.body
            console.log(user_id, prescription_id);
            return await UserAllergicModel.destroy({
                where: { user_id, prescription_id },
                truncate: true
            })
        } catch (error) {
            return error
        }
    }
}
module.exports = new AllergicService()