const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PrescriptionMedicineModel = sequelize.define('prescription_medicine', {
    prescriptionId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
    },
    medicineId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dosage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending'
    }
});
module.exports = PrescriptionMedicineModel;