const departmentController = require('../controllers/department.controller');

const router = require('express').Router();

router.get('/', departmentController.getAllDepartment);

module.exports = router