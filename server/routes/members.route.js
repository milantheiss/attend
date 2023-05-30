const express = require('express');
const { memberController } = require('../controllers');
const verifyToken = require('../middlewares/auth');
const { memberValidation } = require('../validations');
const validate = require('../middlewares/validate');

const router = express.Router();

router
    .route('/')
    .get(verifyToken, memberController.getAllMembers)

module.exports = router;
