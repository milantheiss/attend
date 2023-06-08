const express = require('express');
const { authController, userController } = require('../controllers');
const validate = require('../middlewares/validate');
const { authValidation } = require('../validations');
const verifyToken = require('../middlewares/auth');

const router = express.Router();

router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', authController.logout);
router.patch("/change-password", verifyToken, validate(authValidation.updatePassword), userController.changePassword)
// router.post("/update-password", verifyToken, validate(authValidation.updatePassword), authController.updatePassword);
// router.post('/reset-password', verifyToken, validate(authValidation.resendPassword), authController.resendPassword);

module.exports = router;