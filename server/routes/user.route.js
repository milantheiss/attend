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
    .route("/self")
    .patch(verifyToken, validate(userValidation.updateSelf), userController.updateSelf)

router
    .route('/:id')
    .get(verifyToken, validate(userValidation.getUserById), userController.getUserById)
    .delete(verifyToken, validate(userValidation.deleteUser), userController.deleteUser)
    .patch(verifyToken, validate(userValidation.updateUser), userController.updateUser)

router
    .route('/:id/resend-password')
    .get(verifyToken, validate(userValidation.resendPassword), userController.resendPassword)

module.exports = router;
