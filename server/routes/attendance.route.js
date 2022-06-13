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
    .put(attendanceController.updateAttendance)
    .patch(attendanceController.updateAttendance)
    .delete(attendanceController.deleteAttendance)
router
    .route('/date/:date')
    .get(attendanceController.getAttendanceByDate)

module.exports = router;

