const httpStatus = require('http-status');
const { Attendance, User } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose')

/**
 * Get all attendance lists.
 * @returns {Promise<[Attendance]>}
 */
const getAttendance = async (userId) => {
    //user ist der Benutzer, der die Daten requestet
    const user = await User.findById(userId)

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
const getAttendanceById = async (userId, id) => {
    const user = await User.findById(userId)
    
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
    const user = await User.findById(userId)

    if(user.role === 'admin'){
        //Admin kann auf alle Listen zugreifen
        return Attendance.find({'group._id': groupID})
    }else if (user.role === 'trainer'){
        //User kann nur auf Liste zugreifen, wenn er Zugriff auf die verbundene Gruppe hat
        if(user.accessible_groups.includes(groupID)){
            return Attendance.find({'group._id': groupID})
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
const createAttendance = async (userId, attendanceBody) => {
    const user = await User.findById(userId)
    
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
const addTrainingssession = async (groupID, sessionBody) => {
    const user = await User.findById(userId)
    
    if (user.role === 'admin') {
        return Attendance.findByIdAndUpdate({ 'group._id': groupID }, { $addToSet: { trainingssession: sessionBody } })
    } else if (user.role === 'trainer') {
        if (user.accessible_groups.includes(groupID)){
            return Attendance.findByIdAndUpdate({ 'group._id': groupID }, { $addToSet: { trainingssession: sessionBody } })
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
const updateTrainingssession = async (groupID, date, sessionBody) => {
    const groupObj = await getAttendanceByGroup(groupID)
    let sessions = groupObj.trainingssession
    date = new Date(date)

    for (let i = 0; i < sessions.length; i++) {
        if (sessions[i].date.getMonth() === date.getMonth() && sessions[i].date.getDate() === date.getDate() && sessions[i].date.getFullYear() === date.getFullYear()) {
            sessions[i] = sessionBody
        }
    }


    //WARNING Funktioniert nicht
    Attendance.findOneAndUpdate({'group._id': groupID}, {'$set': {'trainingssession.$[date]': sessionBody}}, {arrayFilters: [ {'date': date}]})

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
