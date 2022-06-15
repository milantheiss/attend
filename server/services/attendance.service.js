const httpStatus = require('http-status');
const {Attendance} = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Get all attendance lists.
 * @returns {Promise<[Attendance]>}
 */
const getAttendance = async () => {
    return Attendance.find({});
};

/**
 * Get a attendance list by ID.
 * @param {ObjectId} id
 * @returns {Promise<Attendance>}
 */
const getAttendanceById = async (id) => {
    return Attendance.findById(id);
};

/**
 * Get a attendance list by groupID & date.
 * @param {ObjectID} groupID ID of the searched group
 * @param {Date} date Date of the searched attendance list
 * @returns {Promise<Attendance>}
 */
const getAttendanceByDate = async (groupID, date) => {
    const attendance = getAttendanceByGroup(groupID)
    for (const training of attendance.trainingssession) {
        const dbDate = new Date(training.date)
        if (dbDate.getDay() === date.getDay() && dbDate.getDate() === date.getDate() && dbDate.getFullYear() === date.getFullYear()) {
            return training
        }
    }
    return {error: "No entrance for given date"}
};

/**
 * Get a attendance list by groupID & date.
 * @param {ObjectID} groupID ID of the searched group
 * @returns {Promise<Attendance>}
 */
const getAttendanceByGroup = async (groupID) => {
    const allAttendance = await getAttendance()
    for (const attendance of allAttendance) {
        if (attendance.group.id === groupID) {
            return attendance
        }
    }
    return {error: "No entrance for given groupID"}
};

/**
 * Create a Attendance List
 * @param {Object} attendanceBody
 * @returns {Promise<Attendance>}
 */
const createAttendance = async (attendanceBody) => {
    return Attendance.create(attendanceBody);
};

/**
 * Add a trainings session to a group
 * @param {ObjectID} groupID ID of the group where to add trainings session to
 * @returns {Promise<Attendance>}
 */
const addTrainingssession = async (groupID, attendanceBody) => {
    return null
};

/**
 * Update a attendance list data
 * @param groupID
 * @param date
 * @param {Object} sessionBody
 * @returns {Promise<Attendance>}
 */
const updateTrainingssession = async (groupID, date, sessionBody) => {
    let groupAttendance = getAttendanceByGroup(groupID)
    console.log(await groupAttendance)
    // let sessions = groupAttendance.trainingssession
    //
    // for (let i = 0; i < sessions.length; i++) {
    //     if (sessions[i].date === update.date){
    //         sessions = sessionBody
    //     }
    // }
    //
    // return Attendance.findByIdAndUpdate({'_id': groupAttendance.id}, {'$set': {'trainingssession': sessions}})
    return groupAttendance
};

/**
 * Delet a attendance list
 * @param attendanceID
 * @returns {Promise<Attendance>}
 */
const deleteAttendance = async (attendanceID) => {
    return Attendance.findByIdAndDelete(attendanceID)
};

//TODO Add new Functions here
module.exports = {
    getAttendanceById,
    getAttendance,
    createAttendance,
    updateTrainingssession,
    deleteAttendance,
    getAttendanceByDate,
    addTrainingssession,
    getAttendanceByGroup
};
