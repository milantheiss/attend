const httpStatus = require('http-status');
const { Group } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');
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
        if (typeof body._id !== 'undefined') {
            //Wenn Member schon existiert, wird er geupdatet
            const group = await Group.findById({ '_id': groupId })

            const oldParticipantData = group.participants.find(e => e._id.equals(body._id))

            console.log(oldParticipantData)
            //TODO Add Call to Attendance Service ...

            //attendanceController.updateParticipantInTrainingssessions(user, groupId, body, oldParticipantData.firsttraining, body.firsttraining)

            return Group.findOneAndUpdate({ '_id': groupId, 'participants._id': body._id }, { '$set': { 'participants.$': body } }, {new: true})
        } else {
            //Wenn Member noch nicht existiert, wird er neu erstellt
            return Group.findByIdAndUpdate({ '_id': groupId }, { $addToSet: { participants: body } }, {new: true})
        }

    } else {
        throw new ApiError(httpStatus.FORBIDDEN, "The user is not permitted to add members to group")
    }
};

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
        return Group.findOneAndUpdate({ '_id': groupId, }, { '$pull': { 'participants': { '_id': memberId } } }, {new: true})
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
