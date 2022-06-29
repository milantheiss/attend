const httpStatus = require('http-status');
const {User} = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Find User by Username
 * @returns {Promise<[User]>}
 */
const getUserByUsername = async (username) => {
    return User.findOne({username})
};

/**
 * Find User by ID
 * @returns {Promise<[User]>}
 */
 const getUserById = async (userID) => {
    return User.findById(userID)
};

/**
 * Adds a refresh token
 * @returns {Promise<[User]>}
 */
 const addRefreshToken = async (userID, token_credentials) => {
    return User.findByIdAndUpdate(userID, {$addToSet: {refresh_tokens: token_credentials}})
};

/**
 * Delete a refresh token
 * @returns {Promise<[User]>}
 */
 const deleteRefreshToken = async (userID, token_id) => {
    return User.findByIdAndUpdate(userID, {$pull: {refresh_tokens: {_id: token_id}}})
};

const getRefreshTokenSecret = async (userID, token_id) => {
    const user = await getUserById(userID)

    //Muss == sein da token_credentials._id typeof ObjectId ist und token_id typeof String
    const secret = user.refresh_tokens.filter(obj=> obj._id == token_id)[0].secret

    if(typeof secret === 'undefined'){
        throw new ApiError(httpStatus.NOT_FOUND, "Refresh token secret was not found")
    }

    return secret
}

module.exports = {
    getUserByUsername,
    getUserById,
    addRefreshToken,
    deleteRefreshToken,
    getRefreshTokenSecret
};
