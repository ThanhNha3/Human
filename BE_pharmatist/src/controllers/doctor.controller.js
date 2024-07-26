const doctorService = require("../services/doctor.service")
const bcrypt = require('bcrypt')

class DoctorController {
    async create(req, res) {
        console.log("thêm mới");
        try {
            const { fullname, phone, gender, age } = req.body
            const existedUser = await doctorService.findByPhone(phone)
            if (existedUser) {
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
            let data = await doctorService.create(userData)
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
            const user = await doctorService.findById(req)
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
            const user = await doctorService.update(data, id)
            res.status(201).json({
                user
            })
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = new DoctorController()