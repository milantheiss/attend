const httpStatus = require('http-status');
const { Attendance } = require('../models');
const { groupService } = require('../services');
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

    const session = attendance.trainingssessions.find(element => element.date.toJSON() === new Date(date).toJSON())

    if (typeof session !== 'undefined'){
        return session
    }else{
        //TODO Add Trainingssession hier

        let formated = []
        
        const temp = (await groupService.getGroupById(user, groupID)).participants

        temp.forEach((participant) => {
            formated.push({
                firstname: participant.firstname,
                lastname: participant.lastname,
                attended: false,
                _id: participant._id
            })
        })

        const sessionBody = {
            date: date,
            participants: formated
        }

        addTrainingssession(user, groupID, sessionBody)
        return sessionBody
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
    if (user.role === 'admin') {
        return Attendance.findOneAndUpdate({ 'group._id': groupID}, { $addToSet: { trainingssessions: sessionBody } })
    } else if (user.role === 'trainer') {
        if (user.accessible_groups.includes(groupID)){
            return Attendance.findOneAndUpdate({ 'group._id': groupID}, { $addToSet: { trainingssessions: sessionBody } })
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
    const session = await getTrainingssession(user, groupID, date)

    let deleteList = true

    //Gleicht updated SessionBody mit session in DB ab
    sessionBody.participants.forEach(participant => {
        const temp = session.participants.find(foo => foo._id == participant._id)
        if(typeof temp === 'undefined'){
            //Wenn participant noch nicht in DB existiert
            //WARNING Kann sein, dass das so nicht funktioniert, da session ein Obj aus Mongoose ist und das geblockt werden könnte
            session.participants.push(participant)
            deleteList = participant.attended ? false : deleteList
        }else{
            temp.attended = participant.attended

            //Wenn temp.attended true soll Liste nicht gelöscht werden.
            deleteList = temp.attended ? false : deleteList
        }
    })

    if(deleteList){
        return deleteTrainingssession(user, groupID, date)
    }
    
    if(user.role === 'admin'){
        return  Attendance.findOneAndUpdate({'group._id': groupID, 'trainingssessions.date': date}, {'$set': {'trainingssessions.$': session}})
    } else if(user.role === 'trainer'){
        if(user.accessible_groups.includes(groupID)){
            return  Attendance.findOneAndUpdate({'group._id': groupID, 'trainingssessions.date': date}, {'$set': {'trainingssessions.$': session}})
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
const deleteAttendance = async (user, attendanceID) => {
    if (user.role === 'admin'){
        return Attendance.findByIdAndDelete(attendanceID)
    } else if (user.role === 'trainer') {
        if(user.accessible_groups.includes(groupID)){
            return Attendance.findByIdAndDelete(attendanceID)
        }
    } else {
        throw new ApiError(httpStatus.FORBIDDEN, "The user is not permitted to delete a attendance list")
    }
};

/**
 * Delete a trainings session
 * @param attendanceID
 * @returns {Promise<Attendance>}
 */
const deleteTrainingssession = async (user, groupID, date) => {
    if (user.role === 'admin'){
        return  Attendance.findOneAndUpdate({'group._id': groupID, }, {'$pull': {'trainingssessions': {'date': date}}})
    } else if(user.role === 'trainer'){
        if(user.accessible_groups.includes(groupID)){
            return  Attendance.findOneAndUpdate({'group._id': groupID, }, {'$pull': {'trainingssessions': {'date': date}}})
        } else {
            throw new ApiError(httpStatus.FORBIDDEN, "The user is not permitted to delete this trainingssession")
        }
    } else {
        throw new ApiError(httpStatus.UNAUTHORIZED, "The user's role has no access to attendance lists")
    }
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
