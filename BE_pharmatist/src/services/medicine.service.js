const { Op } = require("sequelize");
const MedicineModel = require("../models/medicine.model");
const PrescriptionMedicineModel = require("../models/prescription-medicine.model");

class MedicineService {
  async create(req) {
    try {
      return await MedicineModel.create(req);
    } catch (error) {
      return error;
    }
  }

  async findAll(req) {
    try {
      return await MedicineModel.findAll({ where: req });
    } catch (error) {
      return error;
    }
  }
  async findByName(req) {
    try {
      return await MedicineModel.findOne({ where: { name: req.name } });
    } catch (error) {
      return error;
    }
  }
  async findById(req) {
    try {
      return await MedicineModel.findByPk(req);
    } catch (error) {
      return error;
    }
  }
  async findMedicineByName(req) {
    try {
      // Use Op.like to search for medicines with names that contain the search string
      return await MedicineModel.findAll({
        where: {
          name: {
            [Op.like]: `%${req}%`, // The '%' symbols are wildcards in SQL LIKE
          },
        },
      });
    } catch (error) {
      return error;
    }
  }
  async update(data, name) {
    try {
      console.log("data", data);
      console.log("name", name);
      return await MedicineModel.update(data, { where: { name: name } });
    } catch (error) {
      return error;
    }
  }
}
module.exports = new MedicineService();
