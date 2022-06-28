const httpStatus = require('http-status');
const { Attendance, User } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose')

/**
 * Get all attendance lists.
 * @returns {Promise<[Attendance]>}
 */
const getAttendance = async (userId) => {
    const user = await User.findById(userId)

    if (user.role === 'trainer') {
        return await Attendance.find({ 'access': new mongoose.Types.ObjectId(userId) });
    } else if (user.role == 'admin') {
        return Attendance.find({})
    } else {
        return "The user has no access to any attendance list"
    }
};

/**
 * Get a attendance list by ID.
 * @param {ObjectId} id
 * @returns {Promise<Attendance>}
 */
const getAttendanceById = async (userId, id) => {
    const user = await User.findById(userId)
    
    if (user.role == 'admin') {
        return Attendance.findById(id)
    } else {
        const list = await Attendance.findById(id);
        return (list.access.includes(new mongoose.Types.ObjectId(id))) ? list : `The user has no access to the attendance list ${id}`
    }
};

/**
 * Get a attendance list by groupID & date.
 * @param {ObjectID} groupID ID of the searched group
 * @param {Date} date Date of the searched attendance list
 * @returns {Promise<Attendance>}
 */
const getAttendanceByDate = async (userId, groupID, date) => {
    const attendance = await getAttendanceByGroup(userId, groupID)
    for (const training of attendance.trainingssession) {
        const dbDate = new Date(training.date)
        date = new Date(date)
        if (dbDate.getMonth() === date.getMonth() && dbDate.getDate() === date.getDate() && dbDate.getFullYear() === date.getFullYear()) {
            return training
        }
    }
    return { error: "No entrance for given date" }
};

/**
 * Get a attendance list by groupID & date.
 * @param {ObjectID} groupID ID of the searched group
 * @returns {Promise<Attendance>}
 */
const getAttendanceByGroup = async (userId, groupID) => {
    const allAttendance = await getAttendance(userId)
    for (const attendance of allAttendance) {
        if (attendance.group.id === groupID) {
            return Attendance(attendance)
        }
    }
    return { error: "No entrance for given groupID" }
};

/**
 * Create a Attendance List
 * @param {Object} attendanceBody
 * @returns {Promise<Attendance>}
 */
const createAttendance = async (userId, attendanceBody) => {
    const user = await User.findById(userId)
    
    if (user.role == 'admin') {
        return Attendance.create(attendanceBody)
    } else {
        return 'The user has no permission to create a attendance list'
    }
};

/**
 * Add a trainings session to a group
 * @param {ObjectID} groupID ID of the group where to add trainings session to
 * @param sessionBody The body muss include date: Date, participants: [Member]
 * @returns {Promise<Attendance>}
 */
const addTrainingssession = async (groupID, sessionBody) => {

    const groupObj = await getAttendanceByGroup(groupID)
    let sessions = groupObj.trainingssession

    sessions.push(sessionBody)

    return Attendance.findByIdAndUpdate({ '_id': groupObj.id }, { '$set': { 'trainingssession': sessions } })
};

//TODO Über diesen API Endpoint dürfen nicht Namen etc geändert werden Code so anpassen, dass nur update vom boolean möglich ist
/**
 * Update a trainings session
 * @param groupID
 * @param date
 * @param {Object} sessionBody The body muss include date: Date, participants: [Member]
 * @returns {Promise<Attendance>}
 */
const updateTrainingssession = async (groupID, date, sessionBody) => {
    const groupObj = await getAttendanceByGroup(groupID)
    let sessions = groupObj.trainingssession
    date = new Date(date)

    for (let i = 0; i < sessions.length; i++) {
        if (sessions[i].date.getMonth() === date.getMonth() && sessions[i].date.getDate() === date.getDate() && sessions[i].date.getFullYear() === date.getFullYear()) {
            sessions[i] = sessionBody
        }
    }

    return Attendance.findByIdAndUpdate({ '_id': groupObj.id }, { '$set': { 'trainingssession': sessions } })
};

/**
 * Delete a attendance list
 * @param attendanceID
 * @returns {Promise<Attendance>}
 */
const deleteAttendance = async (attendanceID) => {
    return Attendance.findByIdAndDelete(attendanceID)
};

/**
 * Delete a trainings session
 * @param attendanceID
 * @returns {Promise<Attendance>}
 */
const deleteTrainingssession = async (groupID, date) => {
    const groupObj = await getAttendanceByGroup(groupID)
    let sessions = groupObj.trainingssession
    date = new Date(date)

    for (let i = 0; i < sessions.length; i++) {
        if (sessions[i].date.getMonth() === date.getMonth() && sessions[i].date.getDate() === date.getDate() && sessions[i].date.getFullYear() === date.getFullYear()) {
            sessions.splice(i, 1)
        }
    }

    return Attendance.findByIdAndUpdate({ '_id': groupObj.id }, { '$set': { 'trainingssession': sessions } })
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
    getAttendanceByGroup,
    deleteTrainingssession
};
