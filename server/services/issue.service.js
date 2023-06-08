const { Issue } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const memberService = require("./member.service")
const groupService = require("./group.service")
const attendanceService = require("./attendance.service")
const { Member } = require('../models')

const issueTypes = [
    {
        //Wird in member.service erstellt, wenn bereits ein Member mit gleichem Firstname, Lastname & Birthday existiert
        tag: "duplicateMemberInDB",
        actions: [
            {
                command: "merge",
                function: async (issue) => {
                    const keep = await Member.findById(issue.body.memberIDs[0])

                    const ids = issue.body.memberIDs.filter(id => !id.equals(keep._id))
                    await Promise.all(ids.map(async (mergeId) => {
                        const merge = await Member.findById(mergeId)

                        if (!merge) {
                            throw new ApiError(httpStatus.NOT_FOUND, 'Member not found')
                        }

                        keep.groups = [...new Set([...keep._doc.groups, ...merge._doc.groups])]

                        merge.groups.forEach(async (groupId) => {
                            await groupService.updateMemberIdOfParticipant(groupId, keep._id, mergeId)
                            await attendanceService.updateMemberIdOfParticipant(groupId, keep._id, mergeId)
                        })

                        await merge.delete()
                    }))

                    await keep.save()
                    await memberService.removeIssueFromMember(keep._id, issue._id)
                    await issue.delete()
                    return true
                }
            },
            {
                command: "keepBoth",
                function: async (issue) => {
                    await Promise.all(issue.body.memberIDs.map(async (memberId) => {
                        await memberService.removeIssueFromMember(memberId, issue._id)
                    }))
                    await issue.delete()
                    return true
                }
            }
        ]
    },
    {
        //Wird beim Erstellen eines neuen Mitglieds durch einen Trainer in group.controller.js erstellt
        //Wird nur erstellt, wenn nicht ein Duplikat Issue erstellt wird
        tag: "newMemberCreated",
        actions: [
            {
                command: "keep",
                function: async (issue) => {
                    await memberService.removeIssueFromMember(issue.body.memberID, issue._id)
                    await issue.delete()
                    return true
                }
            },
            {
                command: "delete",
                function: async (issue) => {
                    const member = await Member.findById(issue.body.memberID)

                    for (groupId of member.groups) {
                        await groupService.removeMember(groupId, issue.body.memberID)
                        await attendanceService.removeMemberFromAttendanceList(groupId, issue.body.memberID)
                    }

                    await member.delete()
                    await issue.delete()
                    return true
                }
            }
        ]
    }
]

const getIssues = async () => {
    return await Issue.find({});
};

const resolveIssue = async (id, actionCommand) => {
    const issue = await Issue.findById(id)
    if (!issue) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Issue not found')
    }
    const action = issueTypes.find(type => type.tag == issue.tag).actions.find(a => a.command == actionCommand)
    if (!actionCommand) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Action not found')
    }
    await action.function(issue)
    console.log(action);
    return {}
}


module.exports = {
    getIssues,
    resolveIssue
};