const MedicineController = require("../controllers/medicine.controller");
const { authenticateToken, authorizeRoles } = require("../middlewares/auth");

const router = require("express").Router();

router.get("/", MedicineController.findAll);
router.get("/search", MedicineController.findMedicineByName);
router.post("/", MedicineController.create);

module.exports = router;
