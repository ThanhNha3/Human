const bcrypt = require('bcrypt')
const { UserModel } = require('../models/index')
const jwt = require('jsonwebtoken')
const DoctorModel = require('../models/doctor')
class AuthController {
    async register(req, res) {
        try {
            const { fullname, phone, password } = req.body
            let isRegister = await UserModel.findOne({ where: { phone } })
            if (isRegister) {
                return res.status(400).json({
                    message: "Phone already exists"
                })
            }
            const passwordHash = await bcrypt.hash(password, 10)
            let userData = {
                fullname,
                phone,
                password: passwordHash
            }
            await UserModel.create(userData)
            res.status(201).json({
                message: "User created successfully"
            })
        } catch (error) {
            res.status(500).json({ message: "Server error" })
        }
    }
    async login(req, res) {
        try {
            const { phone, password } = req.body
            const user = await UserModel.findOne({ where: { phone } })
            if (user) {
                let isMatch = await bcrypt.compare(password, user.password)
                if (isMatch) {
                    const token = jwt.sign({
                        id: user.id,
                        fullname: user.fullname,
                        role: user.role,
                    }, process.env.JWT_SECRET, { expiresIn: '12h' });
                    console.log(token);
                    return res.status(200).json({
                        message: "Login successfully",
                        token
                    })
                }
                return res.status(400).json({
                    message: "Phone or password is incorrect"
                })
            }
            else {
                const doctor = await DoctorModel.findOne({ where: { phone } })
                if (doctor) {
                    let isMatch = await bcrypt.compare(password, doctor.password)
                    if (isMatch) {
                        const token = jwt.sign({
                            id: doctor.id,
                            fullname: doctor.fullname,
                            role: doctor.role,
                        }, process.env.JWT_SECRET, { expiresIn: '12h' });
                        console.log(token);
                        return res.status(200).json({
                            message: "Login successfully",
                            token
                        })
                    }
                    return res.status(400).json({
                        message: "Phone or password is incorrect"
                    })
                }
            }
            res.status(400).json({
                message: "Phone or password is incorrect"
            })
        } catch (error) {
            res.status(500).json({ message: "Server error" })
        }
    }
}
module.exports = new AuthController()