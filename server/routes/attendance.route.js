const express = require('express');
const { attendanceController } = require('../controllers')
const verifyToken = require('../middlewares/auth');

const router = express.Router();

//TODO Add was geschehen soll wenn gewisse URL mit verschiedenen CRUD Operations angesprochen werden

router
    .route('/')
    .get(verifyToken, attendanceController.getAttendance)
    .post(verifyToken, attendanceController.createAttendance)

// router
//     .route('/:attendanceID')
//     .delete(verifyToken, attendanceController.deleteAttendance)

router
    .route('/byGroupID/:groupID')
    .get(verifyToken, attendanceController.getAttendanceByGroup)
    .put(verifyToken, attendanceController.addTrainingssession)
    .patch(verifyToken, attendanceController.addTrainingssession)

router
    .route('/byGroupID/:groupID/:date')
    .get(verifyToken, attendanceController.getTrainingssession)
    .put(verifyToken, attendanceController.updateTrainingssession)
    .patch(verifyToken, attendanceController.updateTrainingssession)
    .delete(verifyToken, attendanceController.deleteTrainingssession)

router
    .route('/getFormattedList/:groupID/:startdate/:enddate')
    .get(verifyToken, attendanceController.getFormattedList)

module.exports = router;

