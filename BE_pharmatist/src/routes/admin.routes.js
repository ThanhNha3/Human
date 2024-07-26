const adminController = require('../controllers/admin.controller');

const router = require('express').Router();

router.get('/findMostSicknessByAgeGroup', adminController.findMostSicknessByAgeGroup);
router.get('/findUserByAgeGroup', adminController.findUserByAgeGroup);
router.get('/getAverageVisitByAgeGroup', adminController.getAverageVisitByAgeGroup);


module.exports = router