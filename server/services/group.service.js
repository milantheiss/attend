const httpStatus = require('http-status');
const { Group, Attendance, Member, User, Department } = require('../models');
const ApiError = require('../utils/ApiError');
const attendanceService = require('./attendance.service');
const _ = require('lodash');
const mongoose = require('mongoose');

async function getTrainersOfGroup(group) {
    const trainerData = await User.find({ _id: { $in: group.trainers.map(e => e.userId) } }, { firstname: 1, lastname: 1, _id: 1 })
    return (await Promise.all(group.trainers.map(async (trainer) => {
        const t = trainerData.find(e => e._id.equals(trainer.userId))
        try {
            trainer._doc.firstname = t.firstname;
            trainer._doc.lastname = t.lastname;
            trainer._doc._id = t._id;
        } catch (e) {
            console.log(e);
            console.log(group.trainers);
            console.log(group._id);
        }

        return trainer;
    }))).sort((a, b) => a._doc.lastname.localeCompare(b._doc.lastname));
}

async function getParticipantsOfGroup(group) {
    const membersData = await Member.find({ _id: { $in: group.participants.map(e => e.memberId) } }, { firstname: 1, lastname: 1, birthday: 1, _id: 1 })
    return (await Promise.all(group.participants.map(async (participant) => {
        const member = membersData.find(e => e._id.equals(participant.memberId))
        try {
            participant._doc.firstname = member.firstname;
            participant._doc.lastname = member.lastname;
            participant._doc.birthday = member.birthday;
            participant._doc._id = member._id;
        } catch (e) {
            console.log(e);
            console.log(group.participants);
            console.log(group._id);
        }
        return participant;
    }))).sort((a, b) => a._doc.lastname.localeCompare(b._doc.lastname))
}

async function getDepartmentOfGroup(group) {
    const d = await Department.findOne({ _id: group.department }, { name: 1, _id: 1 })
    return d._doc
}

/**
 * Get all groups accessable be the user
 * @param  {import('mongoose').ObjectId} userId
 * @returns {Promise<[Group]>}
 */
const getGroups = async () => {
    let groups = await Group.find({})

    for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        group._doc.trainers = await getTrainersOfGroup(group);
        group._doc.participants = await getParticipantsOfGroup(group);
        group._doc.department = await getDepartmentOfGroup(group)
        groups[i] = group;
    }

    groups.sort((a, b) => a.name.localeCompare(b.name))
    return groups
};

const getAssignedGroups = async (user) => {
    //WARNING Es werden nur assigned groups zurückgegeben
    if (user.accessible_groups.length > 0) {
        let groups = await Group.find({ '_id': { $in: user.accessible_groups } })
        if (groups.length === 0 || groups === null) {
            //Sollten keine Gruppen gefunden worden sein --> Heißt user.access ist leer
            throw new ApiError(httpStatus.NO_CONTENT, 'Groups assigned to the user not found.')
        }

        //Sortieren nach Name
        groups.sort((a, b) => a.name.localeCompare(b.name))

        return groups
    } else {
        throw new ApiError(httpStatus.NO_CONTENT, 'No groups assigned to the user.')
    }
}


/**
 * Get a group by ID.
 * @param {ObjectId} groupId
 * @returns {Promise<Group>}
 */
const getGroupById = async (groupID) => {
    //admin hat Zugriff auf alle Gruppen
    //Es werden nur die Gruppendaten returnt, wenn user access zu der Gruppe hat
    const group = await Group.findById(groupID)

    if (!group) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Group not found')
    }

    group.trainers = await getTrainersOfGroup(group)
    group.participants = await getParticipantsOfGroup(group)
    group._doc.department = await getDepartmentOfGroup(group)

    return group
};

/**
 * Create a Group
 * @param {Object} groupBody
 * @returns {Promise<Group>}
 */
const createGroup = async (groupBody) => {
    //Nur Admins dürfen Gruppen erstellen
    return await Group.create(groupBody);
};

/**
 * Add members to Group Participants
 * Muss checken ob Member schon existiert und ob er in der Gruppe ist.
 * Wenn existiert, dann wird in /member modifiziert und in [participants]
 * Wenn er nicht existiert, dann wird er in /member erstellt und in [participants] hinzugefügt.
 * @param {Object} groupBody
 * @returns {boolean} true if successful
 */
const updateMemberInGroup = async (groupID, memberID, body) => {
    let group = await Group.findById(groupID)
    const member = await Member.findById(memberID)
    Object.assign(member, _.pick(body, ['firstname', 'lastname', 'birthday']))
    await member.save()

    let oldFirsttraining = group._doc.participants.find(e => e.memberId.equals(memberID)).firsttraining

    //Es wird ein Member mit memberId erwartet
    await updateParticipantInTrainingssessions(groupID, memberID, body.firsttraining, oldFirsttraining)

    participant = group.participants.find(e => e.memberId.equals(memberID))
    Object.assign(participant, body)

    await group.save()

    return group
};

const addMember = async (groupID, memberID, firsttraining) => {
    const group = await Group.findById(groupID)
    if (group.participants.some(e => e.memberId.equals(memberID))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Member already in group')
    }

    const member = await Member.findById(memberID)

    if (typeof member === 'undefined' || member === null) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Member not found')
    }

    if (!member.groups.includes(groupID)) {
        member.groups.push(groupID)
    }
    await member.save()

    group.participants.push({ firsttraining: firsttraining, memberId: memberID })

    await updateParticipantInTrainingssessions(groupID, memberID, firsttraining)

    await group.save()
    return group
}

/**
 * Remove Member out of group
 * @param {ObjectId} groupID
 * @returns {Promise<Group>} Updated Group
 */
const removeMember = async (groupID, memberID) => {
    const group = await Group.findById(groupID)

    group.participants = group.participants.filter(e => !e.memberId.equals(memberID))

    const member = await Member.findById(memberID)
    member.groups = member.groups.filter(e => !e.equals(groupID))
    await member.save()

    await group.save()
    return group
};

/**
 * Update Participant in Attendance
 * @param {*} groupID 
 * @param {*} memberID 
 * @param {*} oldFirsttraining Can be undefined for new Participants
 * @param {*} newFirsttraining 
 * @returns {Promise<Attendance>} Updated Attendance
 */
const updateParticipantInTrainingssessions = async (groupID, memberID, newFirsttraining, oldFirsttraining = undefined) => {
    let list = await Attendance.findOne({ group: groupID });

    if (typeof list === "undefined" || list === null) {
        list = await Attendance.create({
            group: new mongoose.Types.ObjectId(groupID),
            trainingssessions: []
        })
    }

    newFirsttraining = new Date(newFirsttraining)
    oldFirsttraining = new Date(oldFirsttraining)

    //Wenn das Datum des Firsttraining früher liegt, als das alte Datum
    if (newFirsttraining > oldFirsttraining) {
        //Participant wird aus allen Trainingsessions entfernt, die früher liegen als newFirsttraining 
        for (const session of list.trainingssessions) {
            //Aus allen Trainingssessions, die jünger sind als oldFirsttraining && älter als newFirsttraining, wird Participant gelöscht
            if (session.date >= oldFirsttraining && session.date < newFirsttraining) {
                session.participants = session.participants.filter(foo => !foo.memberId.equals(memberID))
            }
        }
    } else { //Wenn der Participant neu erstellt wurde oder das Datum des Firsttraining vor dem alten Datum liegt oder gleich geblieben ist
        list.trainingssessions = list.trainingssessions.map((session) => {
            //Wird auf alle Trainingssessions angewenden, die jünger sind als newFirsttraining
            //Wenn oldFristraining undefined ist, ist das Date NaN. isNaN() gibt dann true zurück und der Member wird in die Attendancelist hinzugefügt
            if (session.date >= newFirsttraining && (session.date < oldFirsttraining || isNaN(oldFirsttraining))) {
                participant = session.participants.find(foo => foo.memberId.equals(memberID))

                //Wenn Participant noch nicht in Trainingssession existiert
                if (typeof participant === 'undefined') {
                    session.participants.push({
                        memberId: memberID,
                        attended: false,
                        _id: memberID
                    })
                }
            }
            return session
        })
    }

    await list.save()
    return list
}

/**
 * 
 * @param {*} groupID 
 * @param {{id: String, role: String}} trainerBody 
 */
const addTrainer = async (groupID, trainerBody) => {
    if (typeof trainerBody === 'undefined') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No trainerID given')
    }

    if (typeof groupID === 'undefined') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No groupID given')
    }

    const group = await Group.findById(groupID)

    if (group.trainers.some(e => e.userId.equals(trainerBody.userId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Trainer already in group')
    }

    const user = await User.findById(trainerBody.userId)

    if (!user.accessible_groups.includes(groupID)) {
        user.accessible_groups.push(groupID)
        user.save()
    }

    group.trainers.push(trainerBody)
    await group.save()
}

const removeTrainer = async (groupID, trainerID) => {
    if (typeof trainerID === 'undefined') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No trainerID given')
    }

    if (typeof groupID === 'undefined') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No groupID given')
    }

    const group = await Group.findById(groupID)
    const user = await User.findById(trainerID)

    group.trainers = group.trainers.filter(e => !e.userId.equals(trainerID))

    user.accessible_groups = user.accessible_groups.filter(e => !e.equals(groupID))

    user.save()
    await group.save()
    return group
}

const updateTrainer = async (groupID, userID, trainerBody) => {
    const group = await Group.findById(groupID)

    if (!group) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Group not found')
    }

    group.trainers = group.trainers.map((trainer) => {
        if (trainer.userId.equals(userID)) {
            Object.assign(trainer, trainerBody)
        }
        return trainer
    })

    await group.save()

    return group
}


/**
 * Completely deletes a trainer from the group (So that there is no ref to the user object)
 * @param {*} groupID 
 * @param {*} trainerID 
 */
const deleteTrainer = async (groupID, trainerID) => {
    await removeTrainer(groupID, trainerID)

    await attendanceService.removeTrainerFromAttendanceList(groupID, trainerID)
}

const updateGroup = async (groupID, groupBody, restricted = false) => {
    const group = await Group.findById(groupID)

    if (!group) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Group not found')
    }

    if (restricted) {
        groupBody = _.pick(groupBody, ['times', 'venue'])
    }

    Object.assign(group, groupBody)
    await group.save()
    return group
}

const addMultipleMembers = async (groupID, members) => {
    const group = await Group.findById(groupID)

    await Promise.all(members.map(async (m) => {
        if (typeof m.memberId === 'undefined') {
            m.memberId = m._id
        }

        //Wenn member schon in Gruppe ist, dann wird er übersprungen
        if (group.participants.some(e => e.memberId.equals(m.memberId))) {
            return
        }

        const member = await Member.findById(m.memberId)

        if (typeof member === 'undefined' || member === null) {
            throw new ApiError(httpStatus.NOT_FOUND, `Member with id ${m.memberId} not found`)
        }

        if (!member.groups.includes(groupID)) {
            member.groups.push(groupID)
        }

        await member.save()

        group.participants.push(m)

        await updateParticipantInTrainingssessions(groupID, m.memberId, m.firsttraining)
    }))

    await group.save()
    return group
}

const addMultipleTrainer = async (groupID, trainers) => {
    const group = await Group.findById(groupID)

    await Promise.all(trainers.map(async (t) => {
        if (typeof t.userId === 'undefined') {
            t.userId = t._id
        }

        //Wenn trainer schon in Gruppe ist, dann wird er übersprungen
        if (group.trainers.some(e => e.userId.equals(t.userId))) {
            return
        }

        const user = await User.findById(t.userId)

        if (typeof user === 'undefined' || user === null) {
            throw new ApiError(httpStatus.NOT_FOUND, `User with id ${t.userId} not found`)
        }

        if (!user.accessible_groups.includes(groupID)) {
            user.accessible_groups.push(groupID)
        }

        await user.save()

        group.trainers.push(t)

    }))

    await group.save()
    return group
}

const updateMemberIdOfParticipant = async (groupID, newMemberId, oldMemberId) => {
    const group = await Group.findById(groupID)

    //Id soll geupdatet werden. Wenn die neue Id bereits in der Gruppe ist, dann soll die alte Id gelöscht werden
    if (group.participants.some(e => e.memberId.equals(newMemberId))) {
        const keep = group.participants.find(e => e.memberId.equals(newMemberId))
        const merge = group.participants.find(e => e.memberId.equals(oldMemberId))

        keep.firsttraining = keep.firsttraining < merge.firsttraining ? keep.firsttraining : merge.firsttraining

        group.participants = group.participants.filter(e => !e.memberId.equals(oldMemberId))
    } else {
        group.participants = group.participants.map((p) => {
            if (p.memberId.equals(oldMemberId)) {
                p.memberId = newMemberId
            }
            return p
        })
    }

    return await group.save()
}

const deleteGroup = async (groupID) => {
    await Attendance.findOneAndDelete({ 'group': groupID })
    const members = await Member.find({ groups: groupID })
    await Promise.all(members.map(async (m) => {
        m.groups = m.groups.filter(e => !e.equals(groupID))
        await m.save()
    }))

    const trainers = await User.find({ accessible_groups: groupID })
    await Promise.all(trainers.map(async (t) => {
        t.accessible_groups = t.accessible_groups.filter(e => !e.equals(groupID))
        await t.save()
    }))
    return await Group.findByIdAndDelete(groupID)
}

const exportParticipants = async (groupid, formate = "json") => {
    const group = await getGroupById(groupid);

    group.participants.sort((a, b) => a._doc.lastname.localeCompare(b._doc.lastname))


    if (formate === "csv") {
        const fields = ['lastname', 'firstname', 'birthday']
        let csv = [fields, ...group.participants.map(e => [e._doc.lastname, e._doc.firstname, e._doc.birthday.toJSON().substring(0, 10)])].map(e => e.join(",")).join("\n")
        return csv
    }

    return group.participants
}

module.exports = {
    getGroupById,
    getGroups,
    createGroup,
    updateMemberInGroup,
    removeMember,
    addMember,
    addTrainer,
    removeTrainer,
    deleteTrainer,
    getAssignedGroups,
    updateGroup,
    updateTrainer,
    addMultipleMembers,
    addMultipleTrainer,
    updateMemberIdOfParticipant,
    deleteGroup,
    exportParticipants
};
