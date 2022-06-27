const express = require('express');
const { authenticationController } = require('../controllers')

const router = express.Router();

router
    .route('/')
    .post(authenticationController.logout)

module.exports = router;

