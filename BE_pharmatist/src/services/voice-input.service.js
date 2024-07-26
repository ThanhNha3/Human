const voiceInputModel = require("../models/voice-input.model")

class VoiceInputService {
    async create(req){
        try {
            return await voiceInputModel.create(req)
        } catch (error) {
            return error
        }
    }
}
module.exports = new VoiceInputService()