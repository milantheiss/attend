const logger = require('../config/logger')
const {groupService, attendanceService} = require('../services')
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const getGroups = catchAsync(async (req, res) => {
    const result = await groupService.getGroups();
    logger.debug('Success: GET - all groups')
    res.send(result);
});

const getGroupById = catchAsync(async (req, res) => {
    const result = await groupService.getGroupById(req.params.groupID);
    logger.debug(`Success: GET - group by id: ${req.params.groupID}`)
    res.send(result);
});

const createGroup = catchAsync(async (req, res) => {
    const result = await groupService.createGroup(req.body);
    logger.debug('Success: CREATED - new group')
    res.send(result);
});

const updateGroup = catchAsync(async (req, res) => {
    const result = await groupService.updateGroup(req.params.groupID, req.body);
    logger.debug(`Success: UPDATED - group by id: ${req.params.groupID}`)
    res.send(req.body);
});

const deleteGroup = catchAsync(async (req, res) => {
    const result = await groupService.deleteGroup(req.params.groupID);
    logger.debug(`Success: DELETE - group by id: ${req.params.groupID}`)
    res.send(result)
});

/*

async getGroup(groupID) {
    logger.info('Controller: getGroups', groupID)
    return await groupService.getGroup(groupID);
}

async createGroup(group) {
    logger.info('Controller: createGroup', group);
    return await groupService.createGroup(group);
}

//Trigger PUT Request
async updateGroup(updatedGroup) {
    logger.info('Controller: updateGroup', updatedGroup);
    return await groupService.updateGroup(updatedGroup);
}

async modifyGroup(modification) {
    logger.info('Controller: updateGroup', modification);
    return await groupService.modifyGroup(modification);
}

async deleteGroup(groupID) {
    logger.info('Controller: deleteGroup', groupID);
    return await groupService.deleteGroup(groupId);
}

 */

module.exports = {
    getGroups,
    getGroupById,
    createGroup,
    updateGroup,
    deleteGroup
}

