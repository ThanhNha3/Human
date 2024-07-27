const userControlller = require('../controllers/user.controlller');

const router = require('express').Router();

// router.get('/:id', userControlller.findById);
router.get("/newSymptom/:user_id", userControlller.findNewSymptombyUserId);
router.post('/', userControlller.create);
router.patch('/:id', userControlller.update);

module.exports = router