const httpStatus = require('http-status');
const {User} = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Find User by eMail
 * @returns {Promise<[User]>}
 */
const getUserByEmail = async (email) => {
    return User.findOne({email})
};

/**
 * Adds a refresh token
 * @returns {Promise<[User]>}
 */
 const addRefreshToken = async (userID, token_credentials) => {
    return User.findByIdAndUpdate(userID, {$addToSet: {refresh_tokens: token_credentials}})
};

module.exports = {
    getUserByEmail,
    addRefreshToken
};
