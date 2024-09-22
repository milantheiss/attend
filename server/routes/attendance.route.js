const express = require('express');
const { attendanceController } = require('../controllers')
const verifyToken = require('../middlewares/auth');
const { attendanceValidation } = require('../validations');
const validate = require('../middlewares/validate');

const router = express.Router();

// router
//     .route('/')
//     .get(verifyToken, attendanceController.getAttendance)
//     .post(verifyToken, attendanceController.createAttendance)

router
    .route('/byGroupID/:groupID')
    .get(verifyToken, validate(attendanceValidation.getAttendanceByGroup), attendanceController.getAttendanceByGroup)
// .patch(verifyToken, attendanceController.addTrainingssession)

router
    .route('/byGroupID/:groupID/:date')
    .get(verifyToken, validate(attendanceValidation.getTrainingssession), attendanceController.getTrainingssession)
    .patch(verifyToken, validate(attendanceValidation.updateTrainingssession), attendanceController.updateTrainingssession)
// .delete(verifyToken, attendanceController.deleteTrainingssession)

router
    .route('/getFormattedList/:groupID/:startdate/:enddate')
    .get(verifyToken, validate(attendanceValidation.getFormattedList), attendanceController.getFormattedList)

router.route("/removeDuplicates")
    .post(verifyToken, attendanceController.removeDuplicates);

router.route("/stats")
    .get(verifyToken, validate(attendanceValidation.getStats), attendanceController.getStats);

module.exports = router;

