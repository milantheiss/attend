const httpStatus = require('http-status');
const { default: mongoose } = require('mongoose');
const { Member, Issue, Group, User } = require('../models');
const ApiError = require('../utils/ApiError');
const groupService = require('./group.service');
const attendanceService = require('./attendance.service');
const e = require('express');


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

/**
 * Handels Event which is triggered if a member is added to a group. (Member must not be completely new in DB)
 * WARNING No Access Control: Must be handle from the caller.
 * @param {User} user 
 * @param {Group} group 
 * @param {Object} memberBody 
 * @returns 
 */
const handleNewMemberEvent = async (user, group, memberBody) => {
    //Sucht nach Membern mit dem gleichen Namen und Geburtsdatum
    const members = await Member.find({
        $and: [
            { lastname: memberBody.lastname },
            { firstname: memberBody.firstname },
            { birthday: memberBody.birthday }
        ]
    })

    /*
    Wenn keine gleichen Member gefunden wurden, heißt ein neuer Member hinzugefügt wurde. 
    Wird der Member in der DB angelegt, damit die Daten abgespeichert sind, jedoch wird ein Issue erstellt, damit ein Sachbearbeiter den User verifizieren kann.
    */
    if (members.length === 0) {
        //Der neue Member wird erstellt

        memberBody = {
            ...memberBody,
            departments: [group.department],
            groups: [group._id],
            openIssues: [new mongoose.Types.ObjectId()]
        }

        const newMember = await Member.create(memberBody);

        await Issue.create({
            _id: newMember.openIssues[0],
            tag: 'newMemberCreated',
            date: new Date(),
            body: {
                groupID: group._id,
                memberID: newMember._id,
                createdBy: user._id,
                firstname: newMember.firstname,
                lastname: newMember.lastname,
                birthday: newMember.birthday,
                department: group.department
            }
        })

        newMember.memberId = newMember._id

        //Es muss doc zurückgegeben werden, da sonst die Daten noch verschachtelt sind
        return newMember._doc
    } else {
        //Wenn es mehrere Member mit dem gleichen Namen und Geburtsdatum in der DB existieren, wird ein Issue erstellt, dass dies von einem Sachbearbeiter geprüft werden muss.    
        //TODO Hier sollte eine Whitelist hinzugefügt werden, sodass diese Member ignoriert werden, sollte die Dopplung kein Fehler sein.
        if (members.length > 1) {
            const issue = await Issue.create({
                tag: "duplicateMemberInDB",
                date: new Date(),
                body: {
                    memberIDs: members.map(val => val._id),
                    firstname: members[0].firstname,
                    lastname: members[0].lastname,
                    birthday: members[0].birthday,
                }
            })

            members.forEach(async (member) => {
                member._doc.openIssues.push(issue._id)
                if (!member.groups.includes(group._id)) {
                    member._doc.groups.push(group._id)
                }
                await member.save()
            })

            return members
        }

        //Wenn bereits ein Member existiert, wird ein Issue erstellt, dass der Member zu einer Gruppe hinzugefügt wurde.
        members[0]._doc.memberId = members[0]._id

        //Wenn der Member bereits in der Gruppe ist, wird kein Issue erstellt und einfach nur der Member zurückgeben.
        if (members[0].groups.includes(group._id)) {
            return members[0]._doc
        }

        //Wenn der Member noch nicht dem Department zugeordnet ist zu der die Gruppe gehört, wird ein Issue erstellt, dass der Member dem Department hinzugefügt wurde.
        //INFO Dieses Issues muss nicht erstellt werden. Es wird nur zum Tracken von Veränderungen erstellt
        if (!members[0].departments.includes(group.department)) {
            let issue = await Issue.create({
                tag: "memberWasAddedToDepartment",
                date: new Date(),
                body: {
                    memberID: members[0]._id,
                    firstname: members[0].firstname,
                    lastname: members[0].lastname,
                    birthday: members[0].birthday,
                    department: group.department,
                    groupID: group._id,
                    createdBy: user._id
                }
            })

            members[0]._doc.openIssues = [...members[0], issue._id]
        }

        //Member wird der Gruppe hinzugefügt
        members[0]._doc.groups.push(group._id)

        await members[0].save()

        //Hier muss _doc zurückgegeben werden, da die Daten sonst verschachtelt sind
        return members[0]._doc
    }
}

const updateMember = async (id, memberBody) => {
    let member = await Member.findById(id)

    if (!member) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Member not found')
    }

    if (typeof memberBody.firstname === 'string') {
        member.firstname = memberBody.firstname
    }

    if (typeof memberBody.lastname === 'string') {
        member.lastname = memberBody.lastname
    }

    if (typeof memberBody.birthday === 'string') {
        member.birthday = new Date(memberBody.birthday)
    }

    //TODO Überprüfen ob eine Gruppe entfernt/hinzugefügt wurde --> Dann Member in Gruppe hinzu/entfernen

    if (member.groups.length > memberBody.groups.length) {
        //Remove Member from Group
        const removedGroups = member.groups.filter(group => !memberBody.groups.includes(group))
        for (groupId of removedGroups) {
            await groupService.removeMember(groupId, member._id)
        }
        member.groups = memberBody.groups
    } else if (member.groups.length < memberBody.groups.length) {
        //Add Member to Group
        const newGroups = memberBody.groups.filter(group => !member.groups.includes(group))
        for (groupId of newGroups) {
            await groupService.addMember(groupId, member._id)
        }
        member.groups = memberBody.groups
    }

    await member.save()

    return member
}

const createMember = async (memberBody) => {
    memberBody = {
        ...memberBody,
        birthday: new Date(memberBody.birthday),
        openIssues: [],
        groups: [],
        departments: []
    }

    const member = await Member.create(memberBody)

    return member
}

const deleteMember = async (id) => {
    const member = await Member.findById(id)
    for (groupId of member.groups) {
        await groupService.removeMember(groupId, id)
        await attendanceService.removeMemberFromAttendanceList({ roles: "admin" }, groupId, id)
    }

    await member.delete()

    return member
}

module.exports = {
    getMembers,
    getMemberById,
    handleNewMemberEvent,
    updateMember,
    createMember,
    deleteMember
};
