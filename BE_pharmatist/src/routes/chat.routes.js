var express = require('express');
const geminiController = require('../controllers/gemini.controller');
var chatRouter = express.Router();


const formatPhone = phone => {
    return phone.replace(/[-/ ]/g, "");
}

chatRouter.post('/hash-info', geminiController.hashInfo);

module.exports = chatRouter;