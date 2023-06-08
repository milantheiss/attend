const express = require('express');
const { departmentController } = require('../controllers');
const verifyToken = require('../middlewares/auth');

const router = express.Router();

router
    .route('/')
    .get(verifyToken, departmentController.getDepartments)

module.exports = router;

