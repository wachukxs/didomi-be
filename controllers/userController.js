const express = require('express');
let router = express.Router();

const userService = require('./../services/userService')

const auth = require('../utils/auth')

// can import auth services as middle for routes

// will re-name routes
router.post('/login', userService.logInUser);

router.post('/signup', userService.signUpUser);

router.get('/:email/events', auth.verifyJWT, userService.getEventHistory);

router.delete('/:email', userService.deleteUser);

module.exports = router;