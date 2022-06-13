const httpStatus = require('http-status');
const { Group } = require('../models');
const ApiError = require('../utils/ApiError');

//TODO fúr Gruppen umschreiben
//Service updated/zieht die Daten aus DB

/**
 * Get all groups.
 * @returns {Promise<[Group]>}
 */
const getGroups = async () => {
    return Group.find({});
};

/**
 * Get a group by ID.
 * @param {ObjectId} id
 * @returns {Promise<Group>}
 */
const getGroupById = async (id) => {
    return Group.findById(id);
};

/**
 * Create a Group
 * @param {Object} groupBody
 * @returns {Promise<Group>}
 */
const createGroup = async (groupBody) => {
    return Group.create(groupBody);
};

/**
 * Update a groups data
 * @param groupID
 * @param {Object} groupBody
 * @returns {Promise<Group>}
 */
const updateGroup = async (groupID, groupBody) => {
    return Group.findByIdAndUpdate(groupID,groupBody)
};

/**
 * Delete a group
 * @param groupID
 * @returns {Promise<Group>}
 */
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

//TODO Add new Functions here
module.exports = {
    getGroupById,
    getGroups,
    createGroup,
    updateGroup,
    deleteGroup
};
