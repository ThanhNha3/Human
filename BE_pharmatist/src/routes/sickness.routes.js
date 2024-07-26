const sicknessController = require('../controllers/sickness.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

const router = require('express').Router();

router.post('/', sicknessController.create);
router.patch('/:id', sicknessController.edit);

module.exports = router