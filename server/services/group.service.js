const httpStatus = require('http-status');
const { Group, User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Get all groups accessable be the user
 * @param  {import('mongoose').ObjectId} userId
 * @returns {Promise<[Group]>}
 */
const getGroups = async (userId) => {
    //user ist der Benutzer, der die Daten requestet
    const user = await User.findById(userId)
    
    if(user.role === 'admin'){
        //admin hat Zugriff auf alle Gruppen
        return Group.find({})
    } else if (user.role === 'trainer') { //Oder z.B. Assistent
        //Wenn user ein Trainer o.ä. ist, werden die zugreifbaren Gruppen aus user.accessible_groups genommen
        const groups = await Group.find({'_id': { $in: user.accessible_groups}})
    
        if(!groups.length){
            //Sollten keine Gruppen gefunden worden sein --> Heißt user.access ist leer
            throw new ApiError(httpStatus.NOT_FOUND, 'No groups found to which the user has access.')
        } else {
            return groups
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
const getGroupById = async (userId, groupId) => {
    //user ist der Benutzer, der die Daten requestet
    const user = await User.findById(userId)


    if (user.role === 'admin'){
        //admin hat Zugriff auf alle Gruppen
        return Group.findById(groupId)
    } else if (user.role === 'trainer') {
        if (user.accessible_groups.includes(groupId)){
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
const createGroup = async (userId, groupBody) => {
    const user = await User.findById(userId)

    if (user.role === 'admin') { 
        //Nur Admins dürfen Gruppen erstellen
        return Group.create(groupBody); 
    }else {
        throw new ApiError(httpStatus.FORBIDDEN, "The user is not permitted to create a new group")
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

*/

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
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 *!/
const updateUserById = async (userId, updateBody) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
};

/!**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 *!/
const deleteUserById = async (userId) => {
    const user = await getUserById(userId);
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
};
