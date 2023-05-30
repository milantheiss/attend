const logger = require('../config/logger')
const Group = require('../models/group.model')
const {groupService} = require('../services')
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const getGroups = catchAsync(async (req, res) => {
    res.send(await groupService.getGroups(req.user))
});

const getGroupById = catchAsync(async (req, res) => {
    res.send(await groupService.getGroupById(req.user, req.params.groupID))
});

const createGroup = catchAsync(async (req, res) => {
    //WARNING Nur Admins können Gruppen erstellen
    const result = await groupService.createGroup(req.user, req.body);
    res.status(httpStatus.CREATED).send(result)
});

const updateMember = catchAsync(async (req, res) => {
    res.send(await groupService.updateMember(req.user, req.params.groupID, req.body))
})

const removeMember = catchAsync(async (req, res) => {
    res.send(await groupService.removeMember(req.user, req.params.groupID, req.params.memberID))
})

const searchGroups = catchAsync(async (req, res) => {
    res.send(await groupService.searchGroups(req.user, req.body))
})

const getGroupName = catchAsync(async (req, res) => {
    const group = await Group.findById(req.params.groupID, {name: 1})
    res.send(group)
})

module.exports = {
    getGroups,
    getGroupById,
    createGroup,
    updateMember,
    removeMember,
    searchGroups,
    getGroupName
}

