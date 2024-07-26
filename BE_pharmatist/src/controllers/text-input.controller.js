const textInputService = require("../services/text-input.service");

class TextInputController {
    async create(req, res) {
        try {
            await textInputService.create(req.body)
            res.status(201).json({
                message: "Text input created successfully"
            })
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
}
module.exports = new TextInputController()