const voiceInputService = require("../services/voice-input.service")

class VoiceInputController {
    async create(req, res){
        try {
            await voiceInputService.create(req.body)
            res.status(201).json({
                message: "voice input created"
            })
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
}
module.exports = new VoiceInputController()