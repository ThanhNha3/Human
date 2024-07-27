const langchainController = require("../controllers/langchain.controller");

const router = require("express").Router();

router.post("/predictSickness", langchainController.predictSickness);


module.exports = router;
