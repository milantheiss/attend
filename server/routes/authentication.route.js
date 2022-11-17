const express = require('express');
const { authenticationController } = require('../controllers')

const router = express.Router();

router
    .route('/')
    .post(authenticationController.authenticate)

module.exports = router;