const httpStatus = require('http-status');
const { default: mongoose } = require('mongoose');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');


/**
 * Get all members.
 * @param {mongoose.Types.ObjectId} 
 * @returns {User} 
 */
const getUserInfo = async (userID) => {
    const user = await User.findById(userID)
    return {
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname
    }
};

module.exports = {
    getUserInfo
};