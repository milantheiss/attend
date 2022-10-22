const httpStatus = require('http-status');
const { Group, Attendance } = require('../models');
const ApiError = require('../utils/ApiError');
//const { attendanceController } = require('../controllers');

/**
 * Get all groups accessable be the user
 * @param  {import('mongoose').ObjectId} userId
 * @returns {Promise<[Group]>}
 */
const getGroups = async (user) => {
    if (user.role === 'admin') {
        //admin hat Zugriff auf alle Gruppen
        return Group.find({})
    } else if (user.role === 'trainer') { //Oder z.B. Assistent
        //Wenn user ein Trainer o.ä. ist, werden die zugreifbaren Gruppen aus user.accessible_groups genommen
        const groups = await Group.find({ '_id': { $in: user.accessible_groups } })

        if (!groups.length) {
            //Sollten keine Gruppen gefunden worden sein --> Heißt user.access ist leer
            throw new ApiError(httpStatus.NOT_FOUND, 'No groups found to which the user has access.')
        } else {
            //Es werden nur der Name und die ID der zugreifbaren Gruppen zurückgegeben. 

            let shortenedList = []

            for (const group of groups) {

                shortenedList.push({
                    id: group._id,
                    name: group.name
                })
            }

            return shortenedList
        }
    } else {
        throw new ApiError(httpStatus.UNAUTHORIZED, "The user's role has no access to groups")
    }
};

/**
 * Get a group by ID.
 * @param {ObjectId} groupId
 * @returns {Promise<Group>}
 */
const getGroupById = async (user, groupId) => {
    if (user.role === 'admin') {
        //admin hat Zugriff auf alle Gruppen
        return Group.findById(groupId)
    } else if (user.role === 'trainer') {
        if (user.accessible_groups.includes(groupId)) {
            //Es werden nur die Gruppendaten returnt, wenn user access zu der Gruppe hat
            return Group.findById(groupId)
        } else {
            throw new ApiError(httpStatus.FORBIDDEN, "The user has no access to the requested group")
        }
    } else {
        throw new ApiError(httpStatus.UNAUTHORIZED, "The user's role has no access to groups")
    }
};

/**
 * Create a Group
 * @param {Object} groupBody
 * @returns {Promise<Group>}
 */
const createGroup = async (user, groupBody) => {
    if (user.role === 'admin') {
        //Nur Admins dürfen Gruppen erstellen
        return Group.create(groupBody);
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
const updateMember = async (user, groupId, body) => {
    if (user.role === 'admin' || (user.role === 'trainer' && user.accessible_groups.includes(groupId))) {
        let group
        let oldFirsttraining

        //Wenn Participant noch nicht existiert, wird er neu erstellt
        if (typeof body._id === 'undefined') {
            group = await Group.findByIdAndUpdate({ '_id': groupId }, { $addToSet: { participants: body } }, { new: true })
            body._id = group.participants[group.participants.length - 1]._id
            //oldFirsttraining bleibt 'undefined'
        } else { //Wenn Participant bereits existiert, wird er in Gruppe geupdatet
            group = await Group.findOneAndUpdate({ '_id': groupId, 'participants._id': body._id }, { '$set': { 'participants.$': body } })
            
            //OldFirsttraining wird aus group gezogen
            const foo = group.participants.find(e => e._id.equals(body._id))
            oldFirsttraining = foo.firsttraining

            //Lokale Variable group wird geupdatet für den Return
            foo.firstname = body.firstname
            foo.lastname = body.lastname
            foo.firsttraining = body.firsttraining
        }

        //Attendance wird geupdatet
        updateParticipantInTrainingssessions(groupId, body, oldFirsttraining, body.firsttraining)

        return group
    } else {
        throw new ApiError(httpStatus.FORBIDDEN, "The user is not permitted to add members to group")
    }
};

const updateParticipantInTrainingssessions = async (groupID, participantData, oldFirsttraining, newFirsttraining) => {
    const startTime = Date.now()

    let list = await Attendance.findOne({ 'group._id': groupID });

    newFirsttraining = new Date(newFirsttraining)

    //Wenn der Participant geupdatet wird
    if (typeof oldFirsttraining !== 'undefined') {
        oldFirsttraining = new Date(oldFirsttraining)

        console.log("new " + newFirsttraining)
        console.log('old ' + oldFirsttraining)

        //Fügt Participant neu in Trainingsessions hinzu, wenn newFirsttraining früher war als oldFirsttraining 
        if (newFirsttraining <= oldFirsttraining) {
            for (const session of list.trainingssessions) {
                //Wird auf alle Trainingssessions angewenden, die jünger sind als newFirsttraining
                if (session.date >= newFirsttraining) {
                    console.log(session.date)
                    participant = session.participants.find(foo => foo._id.equals(participantData._id))

                    if (typeof participant !== 'undefined') {
                        participant.firstname = participantData.firstname
                        participant.lastname = participantData.lastname
                    } else { //Wenn Participant noch nicht in Trainingssession existiert
                        console.log('Push new Participant')
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

    console.log("In ms: ", (Date.now() - startTime))
}

/**
 * Get a group by ID and return only info.
 * @param {ObjectId} groupId
 * @returns {Promise<Group>}0
 */
const getGroupInfo = async (user, groupId) => {
    let group = await getGroupById(user, groupId);

    //Deletes participants; muss ._doc sein für delete sein
    delete group._doc.participants

    return group
};


/**
 * Remove Member out of group
 * @param {ObjectId} groupId
 * @returns {Promise<Group>}0
 */
const removeMember = async (user, groupId, memberId) => {
    if (user.role === 'admin' || (user.role === 'trainer' && user.accessible_groups.includes(groupId))) {
        return Group.findOneAndUpdate({ '_id': groupId, }, { '$pull': { 'participants': { '_id': memberId } } }, { new: true })
    } else {
        throw new ApiError(httpStatus.FORBIDDEN, "The user is not permitted to add members to group")
    }
};

//WARNING No Auth implemented
/*

/!**
 * Update a groups data
 * @param groupID
 * @param {Object} groupBody
 * @returns {Promise<Group>}
 *!/
const updateGroup = async (groupID, groupBody) => {
    return Group.findByIdAndUpdate(groupID,groupBody)
};

/!**
 * Delete a group
 * @param groupID
 * @returns {Promise<Group>}
 *!/
const deleteGroup = async (groupID) => {
    return Group.findByIdAndDelete(groupID)
};

/*
/!**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 *!/
const queryUsers = async (filter, options) => {
    const users = await User.paginate(filter, options);
    return users;
};

/!**
 * Update user by id
 * @param {User} user
 * @param {Object} updateBody
 * @returns {Promise<User>}
 *!/
const updateUserById = async (user, updateBody) => {
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (updateBody.email && (await User.isEmailTaken(updateBody.email, user._id))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
};

/!**
 * Delete user by id
 * @param {User} user
 * @returns {Promise<User>}
 *!/
const deleteUserById = async (user) => {
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    await user.remove();
    return user;
};
*/

module.exports = {
    getGroupById,
    getGroups,
    createGroup,
    updateMember,
    getGroupInfo,
    removeMember
};
