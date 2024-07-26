const UserAllergicModel = require("../models/user-allergic.model")
const userService = require("../services/user.service")
const bcrypt = require('bcrypt')

class UserController {
    async create(req, res) {
        try {
            const { fullname, phone, allergic, gender, age } = req.body
            const existedUser = await userService.findByPhone(phone)
            if(existedUser){
                return res.status(200).json({
                   data: {
                    id: existedUser.id,
                    phone: existedUser.phone,
                } 
                })
            }
            const passwordHash = await bcrypt.hash(phone, 10)
            let userData = {
                fullname,
                phone,
                age,
                gender,
                password: passwordHash
            }
            let data = await userService.create(userData)
            const allergics = JSON.parse(allergic)
            Promise.all(allergics.map(async (allergic) => {
                await UserAllergicModel.create({ name: allergic, user_id: data.id })
            }))
            res.status(201).json({
                data: {
                    id: data.id,
                    phone: data.phone,
                }
            })
        } catch (error) {
            console.log(error);
            res.status(500).send(error.message)
        }
    }
    async findById(req, res) {
        try {
            req = req.params.id
            const user = await userService.findById(req)
            res.status(201).json({
                user
            })
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
    async update(req, res) {
        try {
            const id = req.params.id
            const data = req.body
            const user = await userService.update(data, id)
            res.status(201).json({
                user
            })
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = new UserController()