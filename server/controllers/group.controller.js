const logger = require('../config/logger')
const {groupService} = require('../services')
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {getGroupById} = require("../services/group.service");

//TODO Implement simple GET
const getGroups = catchAsync(async (req, res) => {
    const result = await groupService.getGroups();
    res.send(result);
});

const createGroup = catchAsync(async (req, res) => {
    const result = await groupService.createGroup(req.body);
    res.send(result);
});

const updateGroup = catchAsync(async (req, res) => {
    const result = await groupService.updateGroup(req.params.groupID, req.body);
    res.send(result);
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
    createGroup,
    updateGroup
}

