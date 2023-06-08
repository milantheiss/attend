const express = require('express');
const { userController } = require('../controllers');
const verifyToken = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const router = express.Router();

router
    .route('/')
    .get(verifyToken, userController.getUsers)

module.exports = router;
