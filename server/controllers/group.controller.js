const logger = require('../config/logger')
const Group = require('../models/group.model')
const {groupService} = require('../services')
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { hasStaffAccess, hasTrainerRole, hasAccessToGroup } = require('../utils/roleCheck');

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
    if(!hasStaffAccess(req.user) && !hasAccessToGroup(req.user, req.params.groupID)) {
        return res.status(httpStatus.FORBIDDEN).send({message: "You don't have access to this group"})
    }
    const result = await groupService.updateMember(req.params.groupID, req.body)
    res.status(httpStatus.OK).send(result)
})

const removeMember = catchAsync(async (req, res) => {
    if(!hasStaffAccess(req.user) && !hasAccessToGroup(req.user, req.params.groupID)) {
        return res.status(httpStatus.FORBIDDEN).send({message: "You don't have access to this group"})
    }
    const result = await groupService.removeMember(req.params.groupID, req.params.memberID)
    res.status(httpStatus.OK).send(result)
})

const searchGroups = catchAsync(async (req, res) => {
    res.send(await groupService.searchGroups(req.user, req.body))
})

const getGroupName = catchAsync(async (req, res) => {
    const group = await Group.findById(req.params.groupID, {name: 1})
    res.send(group)
})

const addMember = catchAsync(async (req, res) => {
    const result = await groupService.addMember(req.params.groupID, req.body)
    res.status(httpStatus.OK).send(result)
})

module.exports = {
    getGroups,
    getGroupById,
    createGroup,
    updateMember,
    removeMember,
    searchGroups,
    getGroupName,
    addMember
}

