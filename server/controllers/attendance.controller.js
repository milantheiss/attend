const logger = require('../config/logger')
const {attendanceService} = require('../services')
const catchAsync = require('../utils/catchAsync');

const getAttendance = catchAsync(async (req, res) => {
    const result = await attendanceService.getAttendance(req.userID);

    if(result === "The user has no access to any attendance list"){
        logger.warn('GET - all attendance lists: User has no access to any attendance list')
        res.status(403).send(result)
    }else{
        logger.debug('GET - all attendance lists: Success')
        res.send(result);
    }
});

const getAttendanceById = catchAsync(async (req, res) => {
    const result = await attendanceService.getAttendanceById(req.params.attendanceID);
    logger.debug(`GET - attendance list by id: ${req.params.attendanceID}`)
    res.send(result);
});

const createAttendance = catchAsync(async (req, res) => {
    const result = await attendanceService.createAttendance(req.body);
    logger.debug('CREATED - new attendance list')
    res.send(result);
});

const updateTrainingssession = catchAsync(async (req, res) => {
    const result = await attendanceService.updateTrainingssession(req.params.groupID, req.params.date, req.body);
    logger.debug(`UPDATED - attendance list by id: ${req.params.attendanceID}`)
    res.send(result);
});

const deleteAttendance = catchAsync(async (req, res) => {
    const result = await attendanceService.deleteAttendance(req.params.attendanceID);
    logger.debug(`DELETE - attendance list by id: ${req.params.attendanceID}`)
    res.send(result);
});

const getAttendanceByDate = catchAsync(async (req, res) => {
    const result = await attendanceService.getAttendanceByDate(req.userID, req.params.groupID, new Date(req.params.date));
    logger.debug(`GET - attendance list of group ${req.params.groupID} for Date: ${req.params.date}`)
    res.send(result);
});

const getAttendanceByGroup = catchAsync(async (req, res) => {
    const result = await attendanceService.getAttendanceByGroup(req.userID, req.params.groupID);
    logger.debug(`GET - attendance list of group ${req.params.groupID}`)
    res.send(result);
});

const addTrainingssession = catchAsync(async (req, res) => {
    const result = await attendanceService.addTrainingssession(req.params.groupID, req.body);
    logger.debug(`CREATED - new trainings session for group ${req.params.groupID}`)
    res.send(result);
});

const deleteTrainingssession = catchAsync(async (req, res) => {
    const result = await attendanceService.deleteTrainingssession(req.params.groupID, req.params.date);
    logger.debug(`DELETE - trainings session on: ${req.params.date}`)
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
    addTrainingssession,
    deleteTrainingssession
}

