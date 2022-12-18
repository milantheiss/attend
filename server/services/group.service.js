const httpStatus = require('http-status');
const { Group, Attendance, Member } = require('../models');
const memberService = require("../services/member.service")
const ApiError = require('../utils/ApiError');
const { hasAdminRole, hasAccessToGroup, hasTrainerRole, hasAssistantRole } = require('../utils/userroles');
//const { attendanceController } = require('../controllers');

/**
 * Get all groups accessable be the user
 * @param  {import('mongoose').ObjectId} userId
 * @returns {Promise<[Group]>}
 */
const getGroups = async (user) => {
    if (hasAdminRole(user)) {
        //admin hat Zugriff auf alle Gruppen
        return await Group.find({})
    } else if (user.accessible_groups.length > 0) { //Oder z.B. Assistent
        //Wenn user ein Trainer o.ä. ist, werden die zugreifbaren Gruppen aus user.accessible_groups genommen
        const groups = await Group.find({ '_id': { $in: user.accessible_groups } })

        if (!groups.length) {
            //Sollten keine Gruppen gefunden worden sein --> Heißt user.access ist leer
            throw new ApiError(httpStatus.NOT_FOUND, 'No groups found to which the user has access.')
        }

        return groups
    } else {
        throw new ApiError(httpStatus.UNAUTHORIZED, "The user has no access to a groups")
    }
};

/**
 * Get a group by ID.
 * @param {ObjectId} groupId
 * @returns {Promise<Group>}
 */
const getGroupById = async (user, groupID) => {
    if (hasAccessToGroup(user, groupID)) {
        //admin hat Zugriff auf alle Gruppen
        //Es werden nur die Gruppendaten returnt, wenn user access zu der Gruppe hat
        return await Group.findById(groupID)
    } else {
        throw new ApiError(httpStatus.UNAUTHORIZED, "The user has no access to this group")
    }
};

/**
 * Create a Group
 * @param {Object} groupBody
 * @returns {Promise<Group>}
 */
const createGroup = async (user, groupBody) => {
    if (hasAdminRole(user)) {
        //Nur Admins dürfen Gruppen erstellen
        return await Group.create(groupBody);
    } else {
        throw new ApiError(httpStatus.FORBIDDEN, "The user is not permitted to create a new group")
    }
};

/**
 * Add members to Group Participants
 * Muss checken ob Member schon existiert und ob er in der Gruppe ist.
 * Wenn existiert, dann wird in /member modifiziert und in [participants]
 * Wenn er nicht existiert, dann wird er in /member erstellt und in [participants] hinzugefügt.
 * @param {Object} groupBody
 * @returns {Promise<Group>}
 */
const updateMember = async (user, groupID, body) => {
    if (hasAccessToGroup(user, groupID)) {
        let group
        let oldFirsttraining

        //Wenn Participant noch nicht existiert, wird er neu erstellt
        if (typeof body._id === 'undefined') {
            body = await memberService.handleNewMemberEvent(user, await getGroupById(user, groupID), body)
            group = await Group.findByIdAndUpdate({ '_id': groupID }, { $addToSet: { participants: body } }, { new: true })
        } else { //Wenn Participant bereits existiert, wird er in Gruppe geupdatet

            group = await Group.findOneAndUpdate({ '_id': groupID, 'participants._id': body._id }, { '$set': { 'participants.$': body } })

            //OldFirsttraining wird aus group gezogen
            const foo = group.participants.find(e => e._id.equals(body._id))
            oldFirsttraining = foo.firsttraining

            //Lokale Variable group wird geupdatet für den Return
            foo.firstname = body.firstname
            foo.lastname = body.lastname
            foo.firsttraining = body.firsttraining
        }

        //Attendance wird geupdatet
        await updateParticipantInTrainingssessions(groupID, body, oldFirsttraining, body.firsttraining)

        return group
    } else {
        throw new ApiError(httpStatus.FORBIDDEN, "The user is not permitted to add members to group")
    }
};

const updateParticipantInTrainingssessions = async (groupID, participantData, oldFirsttraining, newFirsttraining) => {
    let list = await Attendance.findOne({ 'group._id': groupID });

    //Wird nur ausgeführt, wenn schon Trainingssession bzw. Attendance Documents existieren
    if (typeof list !== "undefined" && list !== null) {
        newFirsttraining = new Date(newFirsttraining)

        //Wenn der Participant geupdatet wird
        if (typeof oldFirsttraining !== 'undefined') {
            oldFirsttraining = new Date(oldFirsttraining)

            //Fügt Participant neu in Trainingsessions hinzu, wenn newFirsttraining früher war als oldFirsttraining 
            if (newFirsttraining <= oldFirsttraining) {
                for (const session of list.trainingssessions) {
                    //Wird auf alle Trainingssessions angewenden, die jünger sind als newFirsttraining
                    if (session.date >= newFirsttraining) {
                        participant = session.participants.find(foo => foo._id.equals(participantData._id))

                        if (typeof participant !== 'undefined') {
                            participant.firstname = participantData.firstname
                            participant.lastname = participantData.lastname
                        } else { //Wenn Participant noch nicht in Trainingssession existiert
                            session.participants.push({
                                firstname: participantData.firstname,
                                lastname: participantData.lastname,
                                attended: false,
                                _id: participantData._id
                            })
                        }
                    }
                }
            } else { //Entfernt Participant in Trainingsessions, wenn newFirsttraining später ist als oldFirsttraining 
                for (const session of list.trainingssessions) {
                    //In allen Trainingssessions, die jünger sind als newFirsttraining, wird Participant geupdatet
                    if (session.date >= newFirsttraining) {
                        participant = session.participants.find(foo => foo._id.equals(participantData._id))
                        participant.firstname = participantData.firstname
                        participant.lastname = participantData.lastname
                    } else if (session.date >= oldFirsttraining) { //Aus allen Trainingssessions, die jünger sind als oldFirsttraining && älter als newFirsttraining, wird Participant gelöscht
                        participant = session.participants.find(foo => foo._id.equals(participantData._id))
                        session.participants.splice(session.participants.indexOf(participant), 1)
                    }
                }
            }
        } else { //Wenn der Participant neu erstellt wird
            for (const session of list.trainingssessions) {
                //Wird auf alle Trainingssessions angewenden, die jünger sind als newFirsttraining
                if (session.date >= newFirsttraining) {
                    session.participants.push({
                        firstname: participantData.firstname,
                        lastname: participantData.lastname,
                        attended: false,
                        _id: participantData._id
                    })
                }
            }
        }

        await Attendance.findOneAndUpdate({ '_id': list._id }, { '$set': { 'trainingssessions': list.trainingssessions } })
    }
}

/**
 * Get a group by ID and return only info.
 * @param {ObjectId} groupId
 * @returns {Promise<Group>}
 */
const getGroupInfo = async (user, groupId) => {
    let group = await getGroupById(user, groupId);

    
    //Deletes participants; muss ._doc sein für delete sein
    delete group._doc.participants

    return group
};

/**
 * Remove Member out of group
 * @param {ObjectId} groupID
 * @returns {Promise<Group>}0
 */
const removeMember = async (user, groupID, memberID) => {
    if (hasAccessToGroup(user, groupID)) {
        await Member.findByIdAndUpdate(memberID, {$pull: {groups: groupID}})
        return await Group.findOneAndUpdate({ '_id': groupID, }, { '$pull': { 'participants': { '_id': memberID } } }, { new: true })
    } else {
        throw new ApiError(httpStatus.FORBIDDEN, "The user is not permitted to add members to group")
    }
};

const searchGroups = async (user, body) => {
    if (hasAdminRole(user) || hasTrainerRole(user) || hasAssistantRole(user)) {
        return await Group.find({ $text: { $search: body.query } })
    } else {
        throw new ApiError(httpStatus.FORBIDDEN, "The user has no permission to search")
    }
}

module.exports = {
    getGroupById,
    getGroups,
    createGroup,
    updateMember,
    getGroupInfo,
    removeMember,
    searchGroups
};
