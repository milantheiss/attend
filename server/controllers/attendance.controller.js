const httpStatus = require('http-status');
const logger = require('../config/logger')
const { attendanceService } = require('../services')
const catchAsync = require('../utils/catchAsync');

const getAttendance = catchAsync(async (req, res) => {
    const result = await attendanceService.getAttendance(req.user);
    logger.debug('GET - all attendance lists')
    res.send(result);

});

const getAttendanceById = catchAsync(async (req, res) => {
    const result = await attendanceService.getAttendanceById(req.user, req.params.attendanceID);
    logger.debug(`GET - attendance list by id ${req.params.attendanceID}`)
    res.send(result);

});

const createAttendance = catchAsync(async (req, res) => {
    const result = await attendanceService.createAttendance(req.user, req.body);
    logger.debug('CREATED - new attendance list')
    res.status(httpStatus.CREATED).send(result);
});

const updateTrainingssession = catchAsync(async (req, res) => {
    const result = await attendanceService.updateTrainingssession(req.user, req.params.groupID, req.params.date, req.body);
    logger.debug(`UPDATED - attendance list by id: ${req.params.attendanceID}`)
    res.send(result);
});

const deleteAttendance = catchAsync(async (req, res) => {
    const result = await attendanceService.deleteAttendance(req.user, req.params.attendanceID);
    logger.debug(`DELETE - attendance list by id: ${req.params.attendanceID}`)
    res.send(result);
});

const getTrainingssession = catchAsync(async (req, res) => {
    const result = await attendanceService.getTrainingssession(req.user, req.params.groupID, new Date(req.params.date));
    logger.debug(`GET - attendance list of group ${req.params.groupID} for Date: ${req.params.date}`)
    res.send(result);
});

const getAttendanceByGroup = catchAsync(async (req, res) => {
    const result = await attendanceService.getAttendanceByGroup(req.user, req.params.groupID);
    logger.debug(`GET - attendance list of group ${req.params.groupID}`)
    res.send(result);
});

const addTrainingssession = catchAsync(async (req, res) => {
    const result = await attendanceService.addTrainingssession(req.user, req.params.groupID, req.body);
    logger.debug(`CREATED - new trainings session for group ${req.params.groupID}`)
    res.send(result);
});

const deleteTrainingssession = catchAsync(async (req, res) => {
    const result = await attendanceService.deleteTrainingssession(req.user, req.params.groupID, req.params.date);
    logger.debug(`DELETE - trainings session on: ${req.params.date}`)
    res.send(result);
});

const runGarbageCollector = catchAsync(async (req, res) => {
    const result = await attendanceService.runGarbageCollector(req.user, req.params.groupID, req.params.date, undefined)
    res.send(result)
})

module.exports = {
    getAttendance,
    getAttendanceById,
    createAttendance,
    updateTrainingssession,
    deleteAttendance,
    getTrainingssession,
    getAttendanceByGroup,
    addTrainingssession,
    deleteTrainingssession,
    runGarbageCollector
}

