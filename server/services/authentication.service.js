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
    let secret
    try{
        secret = user.refresh_tokens.filter(obj=> obj._id == token_id)[0].secret
    }catch(error){
        return undefined
        //throw new ApiError(httpStatus.BAD_REQUEST, "Bad refresh token. Server was unable to regognize the token. Please login again")
    }
    
    if(typeof secret === 'undefined'){
        throw new ApiError(httpStatus.NOT_FOUND, "Refresh token secret was not found")
    }

    return secret
}

//WARNING No Authentication Check
const createUser = async(body) => {
    return await User.create(body)
}

const updateUser = async(userID, body) => {
    return User.findByIdAndUpdate(userID, body)
}

const deleteUser = async(userID) => {
    return User.findByIdAndDelete(userID)
}

module.exports = {
    getUserByUsername,
    getUserById,
    addRefreshToken,
    deleteRefreshToken,
    getRefreshTokenSecret,
    updateUser,
    createUser,
    deleteUser
};
