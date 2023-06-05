const logger = require('../config/logger')
const Group = require('../models/group.model')
const { groupService } = require('../services')
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { hasStaffAccess, hasTrainerRole, hasAccessToGroup } = require('../utils/roleCheck');

const getGroups = catchAsync(async (req, res) => {
    if (!hasStaffAccess(req.user)) {
        return res.status(httpStatus.FORBIDDEN).send({ message: "You don't have access to this group" })
    }
    res.status(httpStatus.OK).send(await groupService.getGroups())
});

const getAssignedGroups = catchAsync(async (req, res) => {
    if (!hasStaffAccess(req.user) && !hasTrainerRole(req.user)) {
        return res.status(httpStatus.FORBIDDEN).send({ message: "You don't have access to this group" })
    }
    res.status(httpStatus.OK).send(await groupService.getAssignedGroups(req.user))
})

const getGroupById = catchAsync(async (req, res) => {
    if (!hasStaffAccess(req.user) && !hasAccessToGroup(req.user, req.params.groupID)) {
        return res.status(httpStatus.FORBIDDEN).send({ message: "You don't have access to this group" })
    }
    res.status(httpStatus.OK).send(await groupService.getGroupById(req.params.groupID))
});

const createGroup = catchAsync(async (req, res) => {
    if (!hasStaffAccess(req.user)) {
        return res.status(httpStatus.FORBIDDEN).send({ message: "You don't have access to this group" })
    }
    const result = await groupService.createGroup(req.body);
    res.status(httpStatus.CREATED).send(result)
});

const updateMember = catchAsync(async (req, res) => {
    if (!hasStaffAccess(req.user) && !hasAccessToGroup(req.user, req.params.groupID)) {
        return res.status(httpStatus.FORBIDDEN).send({ message: "You don't have access to this group" })
    }
    const result = await groupService.updateMember(req.params.groupID, req.params.memberID, req.body)
    res.status(httpStatus.OK).send(result)
})

const removeMember = catchAsync(async (req, res) => {
    if (!hasStaffAccess(req.user) && !hasAccessToGroup(req.user, req.params.groupID)) {
        return res.status(httpStatus.FORBIDDEN).send({ message: "You don't have access to this group" })
    }
    const result = await groupService.removeMember(req.params.groupID, req.params.memberID)
    res.status(httpStatus.OK).send(result)
})

const getGroupName = catchAsync(async (req, res) => {
    if (!hasStaffAccess(req.user) && !hasAccessToGroup(req.user, req.params.groupID)) {
        return res.status(httpStatus.FORBIDDEN).send({ message: "You don't have access to this group" })
    }
    const group = await Group.findById(req.params.groupID, { name: 1 })
    res.status(httpStatus.OK).send(group)
})

const addMember = catchAsync(async (req, res) => {
    if (!hasStaffAccess(req.user)) {
        return res.status(httpStatus.FORBIDDEN).send({ message: "You don't have access to this group" })
    }
    const result = await groupService.addMember(req.params.groupID, req.body.memberId, req.body.firsttraining)
    res.status(httpStatus.OK).send(result)
})

const addTemporaryMember = catchAsync(async (req, res) => {
    if (!hasStaffAccess(req.user) || !hasAccessToGroup(req.user, req.params.groupID)) {
        return res.status(httpStatus.FORBIDDEN).send({ message: "You don't have access to this group" })
    }
    const result = await groupService.addTemporaryMember(req.params.groupID, req.body)
    res.status(httpStatus.OK).send(result)
})

const addTrainer = catchAsync(async (req, res) => {
    if (!hasStaffAccess(req.user)) {
        return res.status(httpStatus.FORBIDDEN).send({ message: "You don't have access to this group" })
    }
    const result = await groupService.addTrainer(req.params.groupID, req.body)
    res.status(httpStatus.OK).send(result)
})

const removeTrainer = catchAsync(async (req, res) => {
    if (!hasStaffAccess(req.user)) {
        return res.status(httpStatus.FORBIDDEN).send({ message: "You don't have access to this group" })
    }
    const result = await groupService.removeTrainer(req.params.groupID, req.params.userID)
    res.status(httpStatus.OK).send(result)
})

const updateTrainer = catchAsync(async (req, res) => {
    if (!hasStaffAccess(req.user)) {
        return res.status(httpStatus.FORBIDDEN).send({ message: "You don't have access to this group" })
    }

    const result = await groupService.updateTrainer(req.params.groupID, req.params.userID, req.body)
    res.status(httpStatus.OK).send(result)
})

const updateGroup = catchAsync(async (req, res) => {
    if (!hasStaffAccess(req.user) && !hasAccessToGroup(req.user, req.params.groupID)) {
        return res.status(httpStatus.FORBIDDEN).send({ message: "You don't have access to this group" })
    }
    const result = await groupService.updateGroup(req.params.groupID, req.body, !hasStaffAccess(req.user))
    res.status(httpStatus.OK).send(result)
})

const addMultipleMembers = catchAsync(async (req, res) => {
    if (!hasStaffAccess(req.user)) {
        return res.status(httpStatus.FORBIDDEN).send({ message: "You don't have access to this group" })
    }
    const result = await groupService.addMultipleMembers(req.params.groupID, req.body)
    res.status(httpStatus.OK).send(result)
})

const addMultipleTrainer = catchAsync(async (req, res) => {
    if (!hasStaffAccess(req.user)) {
        return res.status(httpStatus.FORBIDDEN).send({ message: "You don't have access to this group" })
    }
    const result = await groupService.addMultipleTrainer(req.params.groupID, req.body)
    res.status(httpStatus.OK).send(result)
})

module.exports = {
    getAssignedGroups,
    getGroups,
    getGroupById,
    createGroup,
    updateMember,
    removeMember,
    getGroupName,
    addMember,
    addTrainer,
    removeTrainer,
    updateGroup,
    updateTrainer,
    addMultipleMembers,
    addMultipleTrainer,
    addTemporaryMember
}

