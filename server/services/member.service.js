const httpStatus = require('http-status');
const { Member } = require('../models');
const ApiError = require('../utils/ApiError');
const { hasAdminRole } = require('../utils/userroles');

//Service updated/zieht die Daten aus DB

/**
 * Get all members.
 * @returns {Promise<[Member]>}
 */
const getMembers = async () => {
    return Member.find({});
};

/**
 * Get a group by ID.
 * @param {ObjectId} id
 * @returns {Promise<Member>}
 */
const getMemberById = async (id) => {
    return Member.findById(id);
};

/**
 * Create a Group
 * @param {Object} memberBody
 * @returns {Promise<Member>}
 */
const addMember = async (user, memberBody) => {
    if(hasAdminRole(user)){
        return Member.create(memberBody);
    }else{
        throw new ApiError(httpStatus.FORBIDDEN, "The user is not permitted to create a new member")
    }
    
};


//TODO Add new Functions here
module.exports = {
    getMembers,
    getMemberById,
    addMember
};
