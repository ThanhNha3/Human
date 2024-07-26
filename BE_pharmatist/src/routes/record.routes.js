const AiRecordController = require('../controllers/record.controller');

const router = require('express').Router();

router.post('/', AiRecordController.create);

module.exports = router