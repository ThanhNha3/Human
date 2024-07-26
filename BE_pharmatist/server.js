require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').createServer(app);
const rateLimit = require('express-rate-limit');
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 8888
const sequelize = require('./src/config/db');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use(apiLimiter)
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api', apiLimiter, require('./src/routes/index'))

io.on('connection', require('./src/controllers/socket.controller'));



http.listen(PORT, async () => {
  try {
    await sequelize.sync({ force: false  });
    console.log(`App listening on http://localhost:${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
