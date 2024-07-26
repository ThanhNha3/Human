const doctorController = require('../controllers/doctor.controller');

const router = require('express').Router();

router.post('/', doctorController.create);
router.patch('/:id', doctorController.update);

module.exports = router