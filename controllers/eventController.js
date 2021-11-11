const express = require('express');
let router = express.Router();

const eventService = require('./../services/eventService')

// can import auth services as middle for routes

router.post('/', eventService.newNotificationEvent);

module.exports = router;