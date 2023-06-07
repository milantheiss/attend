const express = require('express');
const { attendanceController } = require('../controllers')
const verifyToken = require('../middlewares/auth');

const router = express.Router();

// router
//     .route('/')
//     .get(verifyToken, attendanceController.getAttendance)
//     .post(verifyToken, attendanceController.createAttendance)

//TODO Verifizierung einbauen

router
    .route('/byGroupID/:groupID')
    .get(verifyToken, attendanceController.getAttendanceByGroup)
    .patch(verifyToken, attendanceController.addTrainingssession)

router
    .route('/byGroupID/:groupID/:date')
    .get(verifyToken, attendanceController.getTrainingssession)
    .patch(verifyToken, attendanceController.updateTrainingssession)
    // .delete(verifyToken, attendanceController.deleteTrainingssession)

router
    .route('/getFormattedList/:groupID/:startdate/:enddate')
    .get(verifyToken, attendanceController.getFormattedList)

module.exports = router;

