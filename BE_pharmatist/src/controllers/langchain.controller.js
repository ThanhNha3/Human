const langchainService = require("../services/langchain.service");

class LangchainController {
    async predictSickness(req, res) {
        try {
            const { input, followUpVisit, oldSickness } = req.body
            const result = await langchainService.predictSickness(input, followUpVisit, oldSickness)
            res.status(201).json({
                result
            })
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
}
module.exports = new LangchainController()