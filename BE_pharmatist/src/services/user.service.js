const sequelize = require("../config/db")
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
    async findNewSymptombyUserId(req) {
        const { user_id } = req;
        try {
            const query = `
SELECT
    p.symptoms
FROM
    prescriptions p
JOIN users u ON
    u.id = p.created_by
WHERE
    u.id = :user_id
ORDER BY
    p.id
DESC
LIMIT 1;
            `;
            const results = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
                replacements: { user_id }
            });
            return results;
        }
        catch (error) {
            return error
        }
    }
}
module.exports = new UserService()