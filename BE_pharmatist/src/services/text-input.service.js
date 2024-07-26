const textInputModel = require("../models/text-input.model")

class TextInputService {
    async create(req){
        try {
            return await textInputModel.create(req)
        } catch (error) {
            return error
        }
    }
}
module.exports = new TextInputService()