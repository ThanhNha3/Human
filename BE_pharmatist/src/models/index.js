const UserModel = require('../models/user.model')
const DepartmentModel = require('./department')
const DoctorModel = require('./doctor')
const MedicineModel = require('./medicine.model')
const PrescriptionMedicineModel = require('./prescription-medicine.model')
const PrescriptionModel = require('./prescription.model')
const SicknessMedicineModel = require('./sickness-medicine.model')
const SicknessModel = require('./sickness.model')
const TextInputModel = require('./text-input.model')
const UserAllergicModel = require('./user-allergic.model')
const UserAllergic = require('./user-allergic.model')
const VoiceInputModel = require('./voice-input.model')
const AiRecordModel = require('./ai_record.model')
const AiRecordMedicineModel = require('./ai_record_medicine.model')
const AiRecordSicknessModel = require('./ai_record_sickness.model')
const AiMedicineModel = require('./ai_medicine.model')
const AiSicknessModel = require('./ai_sickness.model')

//1 user - n voice input
UserModel.hasMany(VoiceInputModel, { foreignKey: 'user_id' })

UserModel.hasMany(TextInputModel, { foreignKey: 'user_id' })

UserModel.hasMany(PrescriptionModel, { foreignKey: 'created_by' })
UserModel.hasMany(PrescriptionModel, { foreignKey: 'accepted_by' })

PrescriptionModel.belongsToMany(MedicineModel, { through: PrescriptionMedicineModel })
PrescriptionModel.hasMany(SicknessModel, { foreignKey: 'prescription_id' })

SicknessModel.belongsToMany(MedicineModel, { through: SicknessMedicineModel })

UserAllergicModel.belongsTo(UserModel, { foreignKey: 'user_id' })
UserAllergicModel.belongsTo(PrescriptionModel, { foreignKey: 'prescription_id' })

DepartmentModel.hasMany(DoctorModel, { foreignKey: 'department_id' })
// AI
AiRecordModel.belongsToMany(AiMedicineModel, { foreignKey: 'ai_record_id', through: AiRecordMedicineModel })
AiRecordModel.belongsToMany(AiSicknessModel, { foreignKey: 'ai_record_id', through: AiRecordSicknessModel })

module.exports = { UserModel, PrescriptionModel, MedicineModel, TextInputModel, VoiceInputModel }