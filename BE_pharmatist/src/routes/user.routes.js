const userControlller = require('../controllers/user.controlller');

const router = require('express').Router();

// router.get('/:id', userControlller.findById);
router.post('/', userControlller.create);
router.patch('/:id', userControlller.update);

module.exports = router