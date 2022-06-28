const logger = require('../config/logger')
const {groupService} = require('../services')
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const getGroups = catchAsync(async (req, res) => {
    const result = await groupService.getGroups(req.userID)
    
    if(result === "The user has no access to any group"){
        logger.warn('GET - all groups: User has no Access to any group')
        res.status(403).send(result)
    }else{
        logger.debug('GET - all groups: Success')
        res.send(result);
    }
    
});

const getGroupById = catchAsync(async (req, res) => {
    const result = await groupService.getGroupById(req.userID, req.params.groupID);
    
    if(result === "The user has no access to this group"){
        logger.warn(`GET - all groups: User has no Access to group  ${req.params.groupID}`)
        res.status(403).send(result)
    }else{
        logger.debug(`GET - group by id: ${req.params.groupID}: Success`)
        res.send(result);
    }
});

const createGroup = catchAsync(async (req, res) => {
    const result = await groupService.createGroup(req.body);

    if(result === "The user has no permission to create a new group"){
        logger.warn('CREATED - new group: User has no permission to create a new group')
        res.status(403).send(result)
    }else{
        logger.debug('CREATED - new group: Success')
        res.send(result);
    }
});

/*

const updateGroup = catchAsync(async (req, res) => {
    const result = await groupService.updateGroup(req.params.groupID, req.body);
    logger.debug(`UPDATED - group by id: ${req.params.groupID}`)
    res.send(req.body);
});

const deleteGroup = catchAsync(async (req, res) => {
    const result = await groupService.deleteGroup(req.params.groupID);
    logger.debug(`DELETE - group by id: ${req.params.groupID}`)
    res.send(result)
});

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
    //updateGroup,
    //deleteGroup
}

