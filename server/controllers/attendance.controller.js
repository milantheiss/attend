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
  logger.debug(`UPDATED - attendance list by groupid: ${req.params.attendanceID}`)
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

const getFormattedList = catchAsync(async (req, res) => {

  const result = await attendanceService.getTrainingssessionsByDateRange(req.user, req.params.groupID, req.params.startdate, req.params.enddate)

  let tempList = {
    dates: [],
    participants: []
  }

  for (session of result.trainingssessions) {
    tempList.dates.push(session.date)
    for (participant of session.participants) {
      const temp = tempList.participants.find(foo => foo._id.equals(participant._id))
      if (typeof temp === 'undefined') {
        tempList.participants.push({
          _id: participant._id,
          firstname: participant.firstname,
          lastname: participant.lastname,
          attendence: [{
            date: session.date,
            attended: participant.attended
          }]
        })
      } else {
        temp.attendence.push({
          date: session.date,
          attended: participant.attended
        })
      }
    }
  }

  tempList.dates.sort((a, b) => a - b)
  tempList.participants.sort((a, b) => a.lastname.localeCompare(b.lastname))

  res.send(tempList)
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
  getFormattedList
}

