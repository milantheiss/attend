const httpStatus = require('http-status');
const logger = require('../config/logger')
const { attendanceService } = require('../services')
const catchAsync = require('../utils/catchAsync');
const { hasAccessToGroup, hasStaffAccess, hasAdminRole, hasDepartmentHeadRole } = require('../utils/roleCheck');
const ApiError = require('../utils/ApiError');
const { get } = require('https');

// const getAttendance = catchAsync(async (req, res) => {
//   const result = await attendanceService.getAttendance(req.user);
//   logger.debug('GET - all attendance lists')
//   res.status(httpStatus.OK).send(result);
// });

// const createAttendance = catchAsync(async (req, res) => {
//   const result = await attendanceService.createAttendance(req.user, req.body);
//   logger.debug('CREATED - new attendance list')
//   res.status(httpStatus.CREATED).send(result);
// });

const updateTrainingssession = catchAsync(async (req, res) => {
  if (!hasAccessToGroup(req.user, req.params.groupID) && !hasStaffAccess(req.user)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have access to this group');
  }
  const result = await attendanceService.updateTrainingssession(req.params.groupID, req.params.date, req.body);
  logger.debug(`UPDATED - attendance list by groupid: ${req.params.groupID}`)
  res.status(httpStatus.OK).send(result);
});

// const deleteAttendance = catchAsync(async (req, res) => {
//   const result = await attendanceService.deleteAttendance(req.user, req.params.attendanceID);
//   logger.debug(`DELETE - attendance list by id: ${req.params.attendanceID}`)
//   res.status(httpStatus.OK).send(result);
// });

const getTrainingssession = catchAsync(async (req, res) => {
  if (!hasAccessToGroup(req.user, req.params.groupID) && !hasStaffAccess(req.user)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have access to this group');
  }
  const result = await attendanceService.getTrainingssession(req.params.groupID, new Date(req.params.date));
  logger.debug(`GET - attendance list of group ${req.params.groupID} on date ${req.params.date}`)
  res.status(httpStatus.OK).setHeader('Content-Type', 'application/json; charset=utf-8').send(result);
});

const getAttendanceByGroup = catchAsync(async (req, res) => {
  if (!hasAccessToGroup(req.user, req.params.groupID) && !hasStaffAccess(req.user)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have access to this group');
  }
  const result = await attendanceService.getAttendanceByGroup(req.params.groupID);
  logger.debug(`GET - attendance list of group ${req.params.groupID}`)
  res.status(httpStatus.OK).send(result);
});

// const addTrainingssession = catchAsync(async (req, res) => {
//   const result = await attendanceService.addTrainingssession(req.user, req.params.groupID, req.body);
//   logger.debug(`CREATED - new trainings session for group ${req.params.groupID}`)
//   res.status(httpStatus.OK).send(result);
// });

// const deleteTrainingssession = catchAsync(async (req, res) => {
//   if (!hasAccessToGroup(req.user, req.params.groupID) && !hasStaffAccess(req.user)) {
//     throw new ApiError(httpStatus.FORBIDDEN, 'You do not have access to this group');
//   }
//   const result = await attendanceService.deleteTrainingssession(req.params.groupID, req.params.date);
//   logger.debug(`DELETE - trainings session on: ${req.params.date}`)
//   res.status(httpStatus.OK).send(result);
// });

const getFormattedList = catchAsync(async (req, res) => {
  if (!hasAccessToGroup(req.user, req.params.groupID) && !hasStaffAccess(req.user)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have access to this group');
  }
  const result = await attendanceService.getFormattedListForAttendanceListPDF(req.params.groupID, req.params.startdate, req.params.enddate);

  res.status(httpStatus.OK).send(result)
})

const removeDuplicates = catchAsync(async (req, res) => {
  if (!hasAdminRole(req.user)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to remove duplicates');
  }
  await attendanceService.removeDuplicates();
  logger.info(`Removed duplicates from attendance list`)
  res.status(httpStatus.OK).send("Success");
});

const getStats = catchAsync(async (req, res) => {
  if (!hasStaffAccess(req.user) && !hasDepartmentHeadRole(req.user) && !hasAccessToGroup(req.user, req.query.groupid)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have access to stats');
  }
  const result = await attendanceService.getStats(req.query.groupid, req.query.startdate, req.query.enddate, req.query.formate);

  res.status(httpStatus.OK).send(result)
})

module.exports = {
  updateTrainingssession,
  getTrainingssession,
  getAttendanceByGroup,
  getFormattedList,
  removeDuplicates,
  getStats
}

