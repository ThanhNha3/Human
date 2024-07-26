const AllergicController = require('../controllers/allergic.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

const router = require('express').Router();

router.get('/:user_id/:prescription_id', AllergicController.findByPrescriptionIdAndName);
router.post('/', AllergicController.create);
router.patch('/', AllergicController.update);
router.patch('/:user_id/:id', AllergicController.updateByUserIdAndPrescriptionIdAndName);
router.delete('/:user_id/:id', AllergicController.delete);
router.delete('/', AllergicController.deleteAll);

module.exports = router