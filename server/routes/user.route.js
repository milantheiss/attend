const express = require('express');
const { userController } = require('../controllers');
const verifyToken = require('../middlewares/auth');
const { userValidation } = require('../validations');
const validate = require('../middlewares/validate');

const router = express.Router();

router
    .route('/')
    .get(verifyToken, userController.getUsers)
    .post(verifyToken, validate(userValidation.createUser), userController.createUser)  

router
    .route('/:id')
    .get(verifyToken, validate(userValidation.getUserById), userController.getUserById)
    .delete(verifyToken, validate(userValidation.deleteUser), userController.deleteUser)
    .patch(verifyToken, validate(userValidation.updateUser), userController.updateUser)

module.exports = router;
