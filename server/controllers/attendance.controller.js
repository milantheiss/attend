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

const updateTrainingssession = catchAsync(async (req, res) => {
    const result = await attendanceService.updateTrainingssession(req.params.groupID, req.params.date, req.body);
    logger.debug(`Success: UPDATED - attendance list by id: ${req.params.attendanceID}`)
    res.send(result);
});

const deleteAttendance = catchAsync(async (req, res) => {
    const result = await attendanceService.deleteAttendance(req.params.attendanceID);
    logger.debug(`Success: DELETE - attendance list by id: ${req.params.attendanceID}`)
    res.send(result);
});

const getAttendanceByDate = catchAsync(async (req, res) => {
    const result = await attendanceService.getAttendanceByDate(req.params.groupID, new Date(req.params.date));
    logger.debug(`Success: GET - attendance list of group ${req.params.groupID} for Date: ${req.params.date}`)
    res.send(result);
});

const getAttendanceByGroup = catchAsync(async (req, res) => {
    const result = await attendanceService.getAttendanceByGroup(req.params.groupID);
    logger.debug(`Success: GET - attendance list of group ${req.params.groupID}`)
    res.send(result);
});

const addTrainingssession = catchAsync(async (req, res) => {
    const result = await attendanceService.addTrainingssession(req.params.groupID, req.body);
    logger.debug(`Success: CREATED - new trainings session for group ${req.params.groupID}`)
    res.send(result);
});

module.exports = {
    getAttendance,
    getAttendanceById,
    createAttendance,
    updateTrainingssession,
    deleteAttendance,
    getAttendanceByDate,
    getAttendanceByGroup,
    addTrainingssession
}

