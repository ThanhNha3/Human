const voiceInputController = require('../controllers/voice-input.controller');

const router = require('express').Router();

router.post('/', voiceInputController.create);

module.exports = router