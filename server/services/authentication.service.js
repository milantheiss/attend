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
    for (const token_credentials of user.refresh_tokens) {
        if(token_credentials._id == token_id){
            return token_credentials.secret
        }
    }
    return undefined
}

module.exports = {
    getUserByUsername,
    getUserById,
    addRefreshToken,
    deleteRefreshToken,
    getRefreshTokenSecret
};
