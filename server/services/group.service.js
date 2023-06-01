const httpStatus = require('http-status');
const { Group, Attendance, Member, User, Department } = require('../models');
const ApiError = require('../utils/ApiError');
const { hasAdminRole, hasAccessToGroup, hasTrainerRole, hasAssistantRole } = require('../utils/roleCheck');
const attendanceService = require('./attendance.service');
const _ = require('lodash');

async function getTrainersOfGroup(group) {
    return await Promise.all(group.trainers.map(async (trainer) => {
        const res = await User.findOne({ _id: trainer.userId }, { firstname: 1, lastname: 1, _id: 1 })
        trainer._doc.firstname = res.firstname;
        trainer._doc.lastname = res.lastname;
        trainer._doc._id = res._id;

        return trainer;
    }));
}

async function getParticipantsOfGroup(group) {
    return await Promise.all(group.participants.map(async (participant) => {
        const res = await Member.findOne({ _id: participant.memberId }, { firstname: 1, lastname: 1, birthday: 1, _id: 1 })
        if (res === null) {
            // console.error(`Member not found ${participant.memberId} in group ${group.name}`);
            return null;
        }
        participant._doc.firstname = res.firstname;
        participant._doc.lastname = res.lastname;
        participant._doc.birthday = res.birthday;
        participant._doc._id = res._id;
        return participant;
    }));
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
    //admin hat Zugriff auf alle Gruppen
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
    if (hasAdminRole(user)) {
        //admin hat Zugriff auf alle Gruppen
        let groups = await Group.find({})
        groups.sort((a, b) => a.name.localeCompare(b.name))
        return groups
    } else if (user.accessible_groups.length > 0) { //Oder z.B. Assistent
        //Wenn user ein Trainer o.ä. ist, werden die zugreifbaren Gruppen aus user.accessible_groups genommen
        let groups = await Group.find({ '_id': { $in: user.accessible_groups } })
        if (groups.length === 0 || groups === null) {
            //Sollten keine Gruppen gefunden worden sein --> Heißt user.access ist leer
            throw new ApiError(httpStatus.NOT_FOUND, 'No groups found to which the user has access.')
        }

        //Sortieren nach Name
        groups.sort((a, b) => a.name.localeCompare(b.name))

        return groups
    }
}


/**
 * Get a group by ID.
 * @param {ObjectId} groupId
 * @returns {Promise<Group>}
 */
const getGroupById = async (user, groupID) => {
    if (hasAccessToGroup(user, groupID)) {
        //admin hat Zugriff auf alle Gruppen
        //Es werden nur die Gruppendaten returnt, wenn user access zu der Gruppe hat
        const group = await Group.findById(groupID)

        if (!group) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Group not found')
        }

        group.trainers = await getTrainersOfGroup(group)
        group.participants = await getParticipantsOfGroup(group)
        group.department = await getDepartmentOfGroup(group)

        return group
    } else {
        throw new ApiError(httpStatus.UNAUTHORIZED, "The user has no access to this group")
    }
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
const updateMember = async (user, groupID, body) => {
    let oldFirsttraining
    let group = await Group.findById(groupID)

    //Wenn Participant noch nicht existiert, wird er neu erstellt
    if (typeof body.memberId === 'undefined') {
        if (!group.participants.some(e => e.memberId.equals(body.memberId))) {
            //Wenn der Member noch nicht Teil der Gruppe ist, wird er hinzugefügt
            body = { ...body, ...await memberService.handleNewMemberEvent(user, group, body) }
            body.memberId = body._id
            group._doc.participants.push(body)
        }
    } else {
        //Wenn Participant bereits existiert, wird er geupdatet
        body = { ...body, ... await memberService.updateMember(body) }
        body.memberId = body._id

        //OldFirsttraining wird aus group gezogen & group lokal geupdatet, damit es zurückgeben werden kann
        group._doc.participants = group._doc.participants.map(e => {
            if (e.memberId.equals(body.memberId)) {
                oldFirsttraining = e.firsttraining
                return body
            }
            return e
        })
    }
    //Es wird ein Member mit memberId erwartet
    await updateParticipantInTrainingssessions(groupID, body, oldFirsttraining, body.firsttraining)

    await group.save()

    return group
};

const addMember = async (groupID, memberBody) => {
    if (typeof memberBody.memberId === 'undefined') {
        memberBody.memberId = memberBody._id
    }

    const group = await Group.findById(groupID)
    if (group.participants.some(e => e.memberId.equals(memberBody.memberId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Member already in group')
    }

    const member = await Member.findById(memberBody.memberId)

    if (typeof member === 'undefined' || member === null) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Member not found')
    }

    if (!member.groups.includes(groupID)) {
        member.groups.push(groupID)
    }
    await member.save()

    group.participants.push(memberBody)

    await updateParticipantInTrainingssessions(groupID, memberBody, undefined, memberBody.firsttraining)

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

    await group.save()
    return group
};

/**
 * Update Participant in Attendance
 * @param {*} groupID 
 * @param {*} participantData 
 * @param {*} oldFirsttraining Can be undefined for new Participants
 * @param {*} newFirsttraining 
 * @returns {Promise<Attendance>} Updated Attendance
 */
const updateParticipantInTrainingssessions = async (groupID, participantData, oldFirsttraining, newFirsttraining) => {
    let list = await Attendance.findOne({ group: groupID });

    //Wird nur ausgeführt, wenn schon Trainingssession bzw. Attendance Documents existieren
    if (typeof list !== "undefined" && list !== null) {
        newFirsttraining = new Date(newFirsttraining)

        //Wenn der Datum Firsttraining verändert wurde, muss der Participant geupdatet werden
        if (typeof oldFirsttraining !== 'undefined') {
            oldFirsttraining = new Date(oldFirsttraining)

            //Fügt Participant neu in Trainingsessions hinzu, wenn newFirsttraining früher war als oldFirsttraining 
            if (newFirsttraining <= oldFirsttraining) {
                for (const session of list.trainingssessions) {
                    //Wird auf alle Trainingssessions angewenden, die jünger sind als newFirsttraining
                    if (session.date >= newFirsttraining) {
                        participant = session.participants.find(foo => foo.memberId.equals(participantData.memberId))
                        //Wenn Participant noch nicht in Trainingssession existiert
                        if (typeof participant === 'undefined') {
                            session.participants.push({
                                memberId: participantData.memberId,
                                attended: false,
                                _id: participantData.memberId
                            })
                        }
                    }
                }
            } else {
                //Entfernt Participant in Trainingsessions, wenn newFirsttraining später ist als oldFirsttraining 
                for (const session of list.trainingssessions) {
                    //Aus allen Trainingssessions, die jünger sind als oldFirsttraining && älter als newFirsttraining, wird Participant gelöscht
                    if (session.date >= oldFirsttraining) {
                        session.participants = session.participants.filter(foo => !foo.memberId.equals(participantData.memberId))
                    }
                }
            }
        } else { //Wenn der Participant neu erstellt wird
            list.trainingssessions = list.trainingssessions.map(session => {
                //Wird auf alle Trainingssessions angewenden, die jünger sind als newFirsttraining
                if (session.date >= newFirsttraining) {
                    session.participants.push({
                        memberId: participantData.memberId,
                        attended: false,
                        _id: participantData.memberId
                    })
                }
                return session
            })
        }

        await list.save()
        return list
    } else {
        throw new ApiError(httpStatus.NOT_FOUND, 'Attendance not found')
    }
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


module.exports = {
    getGroupById,
    getGroups,
    createGroup,
    updateMember,
    removeMember,
    addMember,
    addTrainer,
    removeTrainer,
    deleteTrainer,
    getAssignedGroups
};
