const express = require('express');
const { testController } = require('../controllers');

const router = express.Router();

router
    .route('/')
    .get(testController.getTest)
    .patch(testController.updateTest)

module.exports = router;

