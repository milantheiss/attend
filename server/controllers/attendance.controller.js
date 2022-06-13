const logger = require('../config/logger')
const {attendanceService} = require('../services')
const catchAsync = require('../utils/catchAsync');

const getAttendance = catchAsync(async (req, res) => {
    const result = await attendanceService.getAttendance();
    logger.debug('Success: GET - all attendance lists')
    res.send(result);
});

const getAttendanceById = catchAsync(async (req, res) => {
    const result = await attendanceService.getAttendanceById(req.params.attendanceID);
    logger.debug(`Success: GET - attendance list by id: ${req.params.attendanceID}`)
    res.send(result);
});

const createAttendance = catchAsync(async (req, res) => {
    const result = await attendanceService.createAttendance(req.body);
    logger.debug('Success: CREATED - new attendance list')
    res.send(result);
});

const updateAttendance = catchAsync(async (req, res) => {
    const result = await attendanceService.updateAttendance(req.params.attendanceID, req.body);
    logger.debug(`Success: UPDATED - attendance list by id: ${req.params.attendanceID}`)
    res.send(req.body);
});

const deleteAttendance = catchAsync(async (req, res) => {
    const result = await attendanceService.deleteAttendance(req.params.attendanceID);
    logger.debug(`Success: DELETE - attendance list by id: ${req.params.attendanceID}`)
    res.send(result);
});

const getAttendanceByDate = catchAsync(async (req, res) => {
    const result = await attendanceService.getAttendanceByDate(new Date(req.params.date));
    logger.debug(`Success: GET - attendance list by Date: ${req.params.date}`)
    res.send(result);
});

module.exports = {
    getAttendance,
    getAttendanceById,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendanceByDate
}

