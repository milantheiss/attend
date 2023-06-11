const logger = require('../config/logger')
const Group = require('../models/group.model')
const Issue = require('../models/issue.model')
const { groupService, memberService, attendanceService } = require('../services')
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const _ = require('lodash');
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
    await attendanceService.createAttendance(result._id)
    res.status(httpStatus.CREATED).send(result)
});

const updateMember = catchAsync(async (req, res) => {
    if (!hasStaffAccess(req.user) && !hasAccessToGroup(req.user, req.params.groupID)) {
        return res.status(httpStatus.FORBIDDEN).send({ message: "You don't have access to this group" })
    }
    const result = await groupService.updateMemberInGroup(req.params.groupID, req.params.memberID, req.body)
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

const createAndAddMember = catchAsync(async (req, res) => {
    if (!hasStaffAccess(req.user) || !hasAccessToGroup(req.user, req.params.groupID)) {
        return res.status(httpStatus.FORBIDDEN).send({ message: "You don't have access to this group" })
    }
    const member = await memberService.createMember(_.pick(req.body, ['firstname', 'lastname', 'birthday']))

    if (member._doc.openIssues.length === 0) {
        //Wenn kein Issue existiert, dann wurde kein doppeltes Mitglied gefunden
        //Dem neu erstellten Mitglied wird dann ein newMemberCreated Issue hinzugefügt, 
        //damit das Mitglied verifiziert werden kann
        const issue = await Issue.create({
            tag: 'newMemberCreated',
            date: new Date(),
            body: {
                memberID: member._doc._id,
                createdBy: req.user._id
            },
            message: `**${member.lastname}, ${member.firstname} (Geb. ${new Date(member.birthday).toLocaleDateString('de-DE', { year: '2-digit', month: '2-digit', day: '2-digit' })})** wurde als neues Mitglied erstellt.`
        })

        member._doc.openIssues.push(issue._id)

        await member.save()
    }

    const result = await groupService.addMember(req.params.groupID, member._id, req.body.firsttraining)
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

const deleteGroup = catchAsync(async (req, res) => {
    if (!hasStaffAccess(req.user)) {
        return res.status(httpStatus.FORBIDDEN).send({ message: "You don't have access to delete this group" })
    }

    const result = await groupService.deleteGroup(req.params.groupID)
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
    createAndAddMember,
    deleteGroup
}

