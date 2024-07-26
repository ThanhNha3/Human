const PrescriptionMedicineController = require('../controllers/prescription-medicine.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

const router = require('express').Router();

router.get('/', PrescriptionMedicineController.findAll);
router.post('/', PrescriptionMedicineController.create);
router.get('/:id', PrescriptionMedicineController.findById);
router.get('/medicine/:id', PrescriptionMedicineController.findAllPrescriptionMedicineByPrescriptionId);
router.get('/:user_id/:id', PrescriptionMedicineController.findByPrescriptionId);
router.delete('/:id/:medicineId', PrescriptionMedicineController.removeMedicineById);
router.patch('/accepted/:id', PrescriptionMedicineController.acceptedPrescriptionMedicine);
router.patch('/:id/:medicineId', PrescriptionMedicineController.editByPrescriptionId);
router.patch('/:id', PrescriptionMedicineController.confirmedPrescriptionMedicine);

module.exports = router