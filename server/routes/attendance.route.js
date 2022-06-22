const express = require('express');
const { attendanceController } = require('../controllers')

const router = express.Router();

//TODO Add was geschehen soll wenn gewisse URL mit verschiedenen CRUD Operations angesprochen werden

router
    .route('/')
    .get(attendanceController.getAttendance)
    .post(attendanceController.createAttendance)

router
    .route('/:attendanceID')
    .get(attendanceController.getAttendanceById)
    .delete(attendanceController.deleteAttendance)
router
    .route('/byGroupID/:groupID')
    .get(attendanceController.getAttendanceByGroup)
    .put(attendanceController.addTrainingssession)
    .patch(attendanceController.addTrainingssession)
router
    .route('/byGroupID/:groupID/:date')
    .get(attendanceController.getAttendanceByDate)
    .put(attendanceController.updateTrainingssession)
    .patch(attendanceController.updateTrainingssession)
    .delete(attendanceController.deleteTrainingssession)

//TODO Add patch & post to attendancebygroup

module.exports = router;
