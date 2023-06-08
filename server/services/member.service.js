const httpStatus = require('http-status');
const { Member, Issue } = require('../models');
const ApiError = require('../utils/ApiError');
const groupService = require('./group.service');
const attendanceService = require('./attendance.service');
const _ = require('lodash');


//Service updated/zieht die Daten aus DB

/**
 * Get all members.
 * @returns {Promise<[Member]>}
 */
const getMembers = async () => {
    return Member.find({});
};

/**
 * Get a group by ID.
 * @param {ObjectId} id
 * @returns {Promise<Member>}
 */
const getMemberById = async (id) => {
    return Member.findById(id);
};

const updateMember = async (id, memberBody) => {
    let member = await Member.findById(id)

    if (!member) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Member not found')
    }

    if (!_.isEqual(memberBody.groups, member.groups)) {
        //Remove Member from Group
        const removedGroups = member.groups.filter(group => !memberBody.groups.includes(group))
        for (groupId of removedGroups) {
            await groupService.removeMember(groupId, member._id)
        }
        //Add Member to Group
        const newGroups = memberBody.groups.filter(group => !member.groups.includes(group))
        for (groupId of newGroups) {
            await groupService.addMember(groupId, member._id)
        }
    }

    delete memberBody.groups

    Object.assign(member, memberBody)

    await member.save()

    return member
}

const createMember = async (memberBody) => {
    //Sucht nach Membern mit dem gleichen Namen und Geburtsdatum
    const members = await Member.find({
        $and: [
            { lastname: memberBody.lastname },
            { firstname: memberBody.firstname },
            { birthday: memberBody.birthday }
        ]
    })

    memberBody = {
        ...memberBody,
        birthday: new Date(memberBody.birthday),
        openIssues: [],
        groups: [],
        departments: []
    }

    const member = await Member.create(memberBody)

    if (members.length === 0) {
        return member
    }

    //Wenn mehrere Member mit dem gleichen Namen und Geburtsdatum in der DB existieren, wird ein Issue erstellt, dass dies von einem Sachbearbeiter geprüft werden muss.
    const issue = await Issue.create({
        tag: "duplicateMemberInDB",
        date: new Date(),
        body: {
            memberIDs: [...members.map(val => val._id), member._id].sort((a, b) => a.getTimestamp() - b.getTimestamp()),
        },
        message: `Für **${member.lastname}, ${member.firstname} (Geb. ${new Date(member.birthday).toLocaleDateString('de-DE', { year: '2-digit', month: '2-digit', day: '2-digit' })})** existieren doppelte Einträge`
    })

    members.forEach(async (member) => {
        member._doc.openIssues.push(issue._id)
        await member.save()
    })

    member._doc.openIssues.push(issue._id)

    await member.save()

    return member
}

const deleteMember = async (id) => {
    const member = await Member.findById(id)
    for (groupId of member.groups) {
        await groupService.removeMember(groupId, id)
        await attendanceService.removeMemberFromAttendanceList(groupId, id)
    }

    await member.delete()

    return member
}

const removeIssueFromMember = async (memberId, issueId) => {
    const member = await Member.findById(memberId)
    member.openIssues = member.openIssues.filter(issue => !issue.equals(issueId))

    console.log(memberId, issueId, member.openIssues);

    return await member.save()
}


module.exports = {
    getMembers,
    getMemberById,
    updateMember,
    createMember,
    deleteMember,
    removeIssueFromMember
};
