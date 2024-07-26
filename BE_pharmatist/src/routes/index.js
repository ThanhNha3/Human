const geminiController = require('../controllers/gemini.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

const app = require('express')();

app.get('/', (req, res) => {
    res.send('Welcome to the API')
});
app.use('/users', require('./user.routes'));
app.use('/voice-inputs', require('./voice-input.routes'));
app.use('/text-inputs', require('./text-input.routes'));
app.use('/chat', require('./chat.routes'))
app.use('/auth', require('./auth.routes'));
app.use('/prescriptions', require('./prescription.routes'));
app.use('/medicines', require('./medicine.routes'));
app.use('/prescription-medicines', require('./prescription-medicine.routes'));
app.use('/medicines', require('./medicine.routes'));
// app.post('/hash-info', geminiController.hashInfo)
app.post('/generate-diagnosis', geminiController.generateDiagnose)
app.post('/generate-medicine', geminiController.generateMedicine)
app.use('/allergic', require('./allergic.routes'))
app.use('/sickness', require('./sickness.routes.js'))
app.use('/excel', require('./excel.routes.js'))
app.use("/doctor", require("./doctor.routes.js"))
app.use("/ai-record", require("./record.routes.js"))
app.use("/departments", require("./department.routes.js"))
app.use("/admin", require("./admin.routes.js"))

module.exports = app