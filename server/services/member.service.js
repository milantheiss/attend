const httpStatus = require('http-status');
const { Member } = require('../models');
const ApiError = require('../utils/ApiError');

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
const addMember = async (memberBody) => {
    return Member.create(memberBody);
};


//TODO Add new Functions here
module.exports = {
    getMembers,
    getMemberById,
    addMember
};
