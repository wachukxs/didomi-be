const express = require('express');
const cors = require('cors') // or https://stackoverflow.com/a/68971146/9259701
const app = express();

// set before using routes
app.use(cors())
app.use(express.json());

// routes
let userRoutes = require('../controllers/userController')
let eventRoutes = require('../controllers/eventController')

app.use('/api/v1/user', userRoutes)
app.use('/api/v1/event', eventRoutes)

module.exports = app