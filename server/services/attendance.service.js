const httpStatus = require('http-status');
const { Attendance, User } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose')

/**
 * Get all attendance lists.
 * @returns {Promise<[Attendance]>}
 */
const getAttendance = async (user) => {
    //user ist der Benutzer, der die Daten requestet

    if (user.role === 'admin') {
        //admin hat Zugriff auf alle Attendance Lists
        return Attendance.find({})
    } else if (user.role === 'trainer') {
        //Wenn user ein Trainer o.ä. ist, wird für alle Attendance Lists die einer Gruppe zugewiesen sind, 
        //auf die der User Zugriff hat
        const list = await Attendance.find({'group._id': {$in: user.accessible_groups}})
        
        if(!list.length){
            throw new ApiError(httpStatus.NOT_FOUND, 'No attendance list found for groups to which the user has access')
        } else {
            return list
        }
    } else {
        throw new ApiError(httpStatus.UNAUTHORIZED, "The user's role has no access to any attendance list")
    }
};

//WARNING Unused
/*
 * Get a attendance list by ID.
 * @param {ObjectId} id
 * @returns {Promise<Attendance>}
 */
const getAttendanceById = async (user, id) => {
    if (user.role === 'admin') {
        //Admin kann auf alle Attendance Lists zugreifen
        return Attendance.findById(id)
    } else if (user.role === 'trainer'){
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
const getTrainingssession = async (user, groupID, date) => {
    //INFO Access controle wird von 'getAttendanceByGroup' gehandelt
    const attendance = await getAttendanceByGroup(user, groupID)

    const session = attendance.trainingssession.find(element => element.date.toJSON() === new Date(date).toJSON())

    if (typeof session !== 'undefined'){
        return session
    }else{
        throw new ApiError(httpStatus.NOT_FOUND, "Requested Trainingssession not found")
    }
};

/**
 * Get a attendance list by groupID & date.
 * @param {ObjectID} groupID ID of the searched group
 * @returns {Promise<Attendance>}
 */
const getAttendanceByGroup = async (user, groupID) => {
    if(user.role === 'admin'){
        //Admin kann auf alle Listen zugreifen
        return Attendance.findOne({'group._id': groupID})
    }else if (user.role === 'trainer'){
        //User kann nur auf Liste zugreifen, wenn er Zugriff auf die verbundene Gruppe hat
        if(user.accessible_groups.includes(groupID)){
            return Attendance.findOne({'group._id': groupID})
        }else{
            throw new ApiError(httpStatus.FORBIDDEN, "The user has no access to the group associated with this attendance list")
        }
    }else{
        throw new ApiError(httpStatus.UNAUTHORIZED, "The user's role has no access to attendance lists")
    }
};

/**
 * Create a Attendance List
 * @param {Object} attendanceBody
 * @returns {Promise<Attendance>}
 */
const createAttendance = async (user, attendanceBody) => {
    if (user.role === 'admin') {
        return Attendance.create(attendanceBody)
    } else {
        throw new ApiError(httpStatus.FORBIDDEN, "The user is not permitted to create a new attendance list")
    }
};

/**
 * Add a trainings session to a group
 * @param {ObjectID} groupID ID of the group where to add trainings session to
 * @param sessionBody The body muss include date: Date, participants: [Member]
 * @returns {Promise<Attendance>}
 */
const addTrainingssession = async (user, groupID, sessionBody) => {
    console.log('in add')
    if (user.role === 'admin') {
        return Attendance.findOneAndUpdate({ 'group._id': groupID}, { $addToSet: { trainingssession: sessionBody } })
    } else if (user.role === 'trainer') {
        if (user.accessible_groups.includes(groupID)){
            return Attendance.findOneAndUpdate({ 'group._id': groupID}, { $addToSet: { trainingssession: sessionBody } })
        } else{
            throw new ApiError(httpStatus.FORBIDDEN, "The user is not permitted to add a trainingssession")
        }
    } else {
        throw new ApiError(httpStatus.UNAUTHORIZED, "The user's role has no access to attendance lists")
    }
};

//TODO Über diesen API Endpoint dürfen nicht Namen etc geändert werden Code so anpassen, dass nur update vom boolean möglich ist
/**
 * Update a trainings session
 * @param groupID
 * @param date
 * @param {Object} sessionBody The body muss include date: Date, participants: [Member]
 * @returns {Promise<Attendance>}
 */
const updateTrainingssession = async (user, groupID, date, sessionBody) => {
    const trainingssession = await getTrainingssession(user, groupID, date)

    console.log('session'  + sessionBody)
    
//TODO Add Access Control hier

    /*
    let sessions = groupObj.trainingssession
    date = new Date(date)

    for (let i = 0; i < sessions.length; i++) {
        if (sessions[i].date.getMonth() === date.getMonth() && sessions[i].date.getDate() === date.getDate() && sessions[i].date.getFullYear() === date.getFullYear()) {
            sessions[i] = sessionBody
        }
    }

    trainingssession.participants.forEach(participant => {
        console.log(sessionBody)
    });

    */

    //WARNING Funktioniert nicht
   
    if(user.role === 'admin'){
        return  Attendance.findOneAndUpdate({'group._id': groupID, 'trainingssession.date': date}, {'$set': {'trainingssession.$': sessionBody}})
    } else if(user.role === 'trainer'){
        console.log('durchgekommen')
        if(user.accessible_groups.includes(groupID)){
            return  Attendance.findOneAndUpdate({'group._id': groupID, 'trainingssession.date': date}, {'$set': {'trainingssession.$': sessionBody}})
        }else{
            throw new ApiError(httpStatus.FORBIDDEN, "The user is not permitted to update this trainingssession")
        }
    } else {
        throw new ApiError(httpStatus.UNAUTHORIZED, "The user's role has no access to attendance lists")
    }
    
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
const deleteTrainingssession = async (user, groupID, date) => {
    const groupObj = await getAttendanceByGroup(user, groupID)
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
    getTrainingssession,
    getAttendanceByGroup,
    deleteTrainingssession,
    addTrainingssession
};
