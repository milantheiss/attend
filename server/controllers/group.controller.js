const logger = require('../config/logger')
const {groupService} = require('../services')
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const getGroups = catchAsync(async (req, res) => {
    res.send(await groupService.getGroups(req.user))
});

const getGroupById = catchAsync(async (req, res) => {
    res.send(await groupService.getGroupById(req.user, req.params.groupID))
});

const getGroupInfo = catchAsync(async (req, res) => {
    res.send(await groupService.getGroupInfo(req.user, req.params.groupID))
});

const createGroup = catchAsync(async (req, res) => {
    //WARNING Nur Admins können Gruppen erstellen
    const result = await groupService.createGroup(req.user, req.body);
    res.status(httpStatus.CREATED).send(result)
});

const addMember = catchAsync(async (req, res) => {
    res.send(await groupService.addMember(req.user, req.params.groupID, req.body))
})

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
    addMember,
    getGroupInfo
}

