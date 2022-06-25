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

module.exports = {
    getUserByEmail
};
