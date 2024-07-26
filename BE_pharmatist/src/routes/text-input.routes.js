const textInputController = require('../controllers/text-input.controller');

const router = require('express').Router();

router.post('/',textInputController.create);

module.exports = router