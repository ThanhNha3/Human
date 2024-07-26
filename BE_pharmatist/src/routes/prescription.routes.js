const PrescriptionController = require('../controllers/prescription.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

const router = require('express').Router();

router.get('/sicknesses/:id', PrescriptionController.getAllSicknessByPrescriptionId);
router.post('/', PrescriptionController.create);
router.post('/:id/sicknesses',authenticateToken, authorizeRoles("doctor"), PrescriptionController.createSickness);
router.put('/:id/sicknesses/order',authenticateToken, authorizeRoles("doctor"), PrescriptionController.updateSicknessOrder);
router.get('/',authenticateToken, authorizeRoles("doctor","pharmartist"), PrescriptionController.findAll);
router.get('/user/:user_id', PrescriptionController.getAllPrescriptionByUserId);

// router.get('/:user_id/:id', PrescriptionController.findById);
router.get('/:id', PrescriptionController.findById);
router.patch('/:user_id/:id', PrescriptionController.editPrescriptionById);
router.delete('/:prescription_id/sicknesses/:id', PrescriptionController.deleteSickness);
router.delete('/:user_id/:id', PrescriptionController.deleteByPrescriptionId);

module.exports = router