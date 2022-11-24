const httpStatus = require('http-status');
const { Attendance } = require('../models');
const { groupService } = require('../services');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');
const logger = require('../config/logger');
const { hasAdminRole, hasAccessToGroup } = require('../utils/userroles');

/**
 * Get all attendance lists.
 * @returns {Promise<[Attendance]>}
 */
const getAttendance = async (user) => {
    //user ist der Benutzer, der die Daten requestet

    if (hasAdminRole(user)) {
        //admin hat Zugriff auf alle Attendance Lists
        return Attendance.find({})
    } else if (user.accessible_groups.length > 0) {
        //Wenn user ein Trainer o.ä. ist, wird für alle Attendance Lists die einer Gruppe zugewiesen sind, 
        //auf die der User Zugriff hat
        const list = await Attendance.find({ 'group._id': { $in: user.accessible_groups } })

        if (!list.length) {
            throw new ApiError(httpStatus.NOT_FOUND, 'No attendance list found for groups to which the user has access')
        } else {
            return list
        }
    } else {
        throw new ApiError(httpStatus.UNAUTHORIZED, "The user has no access to any group")
    }
};

/**
 * Get a attendance list by groupID & date.
 * @param {ObjectID} groupID ID of the searched group
 * @param {Date} date Date of the searched attendance list
 * @returns {Promise<Attendance>}   
 */
const getTrainingssession = async (user, groupID, date) => {
    //INFO Access control wird von 'getAttendanceByGroup' gehandelt
    const attendance = await getAttendanceByGroup(user, groupID)
    let session

    //Falls es noch gar keine Attendance gibt, 
    try {
        session = attendance.trainingssessions.find(element => element.date.toJSON() === new Date(date).toJSON())
    } catch { }

    if (typeof session === 'undefined' && session == null) {
        //Get Trainingssession schickt nur den Body zurück. Erstellt aber keine neue Trainingssession in DB
        //Update aufgerufen wird, kann dann der Body in DB erstellt werden --> Erzeugt weniger DB Calls und weniger Garbage

        let formatted = []

        const temp = (await groupService.getGroupById(user, groupID)).participants
        
        date = new Date(date)
        
        temp.forEach((participant) => {
            if (date >= participant.firsttraining) {
                formatted.push({
                    firstname: participant.firstname,
                    lastname: participant.lastname,
                    attended: false,
                    _id: participant._id
                })
            }
        })

        const sessionBody = {
            date: date,
            participants: formatted
        }


        return sessionBody
    } else {
        return session
    }
};

/**
 * Get a attendance list by groupID & date.
 * @param {ObjectID} groupID ID of the searched group
 * @returns {Promise<Attendance>}
 */
const getAttendanceByGroup = async (user, groupID) => {
    if (hasAccessToGroup(user, groupID)) {
        //Admin kann auf alle Listen zugreifen. Trainer kann nur auf Liste zugreifen, wenn er access auf die Gruppe hat.
        try {
            const _res = await Attendance.findOne({ 'group._id': groupID })

            //Wenn noch keine Attendance Document existiert, ist _res null
            if (_res !== null && typeof _res !== 'undefined') {
                return _res
            } else { //Erstellt neues Attendance Document
                return Attendance.create({
                    group: {
                        _id: new mongoose.Types.ObjectId(groupID)
                    },
                    trainingssessions: []
                })
            }
        } catch (e) {
            console.log(e)
        }
    } else {
        throw new ApiError(httpStatus.UNAUTHORIZED, "The user has no access to attendance lists")
    }
};

/**
 * Create a Attendance List
 * @param {Object} attendanceBody
 * @returns {Promise<Attendance>}
 */
const createAttendance = async (user, attendanceBody) => {
    if (hasAdminRole(user)) {
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
    if (hasAccessToGroup(user, groupID)) {
        try {
            const _res = await Attendance.findOneAndUpdate({ 'group._id': groupID }, { $addToSet: { trainingssessions: sessionBody } })

            //Wenn noch keine Attendance Document existiert, ist _res null
            if (_res !== null && typeof _res !== 'undefined') {
                return _res
            } else { //Erstellt neues Attendance Document
                return Attendance.create({
                    group: {
                        _id: new mongoose.Types.ObjectId(groupID)
                    },
                    trainingssessions: [
                        sessionBody
                    ]
                })
            }
        } catch (e) {
            console.log(e)
        }
    } else {
        throw new ApiError(httpStatus.UNAUTHORIZED, "The user has no access to attendance lists")
    }
};

//TODO Über diesen API Endpoint dürfen nicht Namen etc geändert werden Code so anpassen, dass nur update vom boolean möglich ist
/**
 * Update a trainings session. Wird nicht beim hinzufügen von neuen Member benutzt.
 * @param groupID
 * @param date
 * @param {Object} sessionBody The body muss include date: Date, participants: [Member]
 * @returns {Promise<Attendance>}
 */
const updateTrainingssession = async (user, groupID, date, sessionBody) => {
    if (hasAccessToGroup(user, groupID)) {
        const session = await getTrainingssession(user, groupID, new Date(date))

        //Gleicht updated SessionBody mit session in DB ab
        //SessionBody wird nicht direkt in DB übertrage, damit keine anderen Werte, außer attended verändert werden können.
        sessionBody.participants.forEach(participant => {
            const temp = session.participants.find(foo => foo._id == participant._id)
            //Es werden nur Teilnehmer, die in der DB existieren geupdatet. Um neue Participant hinzuzufügen, muss er erst hinzugefügt werden.
            if (typeof temp !== 'undefined') {
                temp.attended = participant.attended
            }
        })

        if (!session.participants.some(participant => participant.attended === true)) {
            console.log("Delete Trainingssession");
            await runGarbageCollector(user, groupID, date, session)
        } else {
            //Wenn eine ganz neue Trainingssession erstellt werden muss
            if (typeof session._id === 'undefined') {
                console.log('Add new Trainingssession');
                await Attendance.findOneAndUpdate({ 'group._id': groupID }, { $addToSet: { trainingssessions: sessionBody } })
            } else {
                console.log('Update Trainingssession');
                await Attendance.findOneAndUpdate({ 'group._id': groupID, 'trainingssessions.date': date }, { '$set': { 'trainingssessions.$': session } })  
            }
        }
        return await getTrainingssession(user, groupID, date)
    } else {
        throw new ApiError(httpStatus.UNAUTHORIZED, "The user's role has no access to attendance lists")
    }
};

/**
 * Checks for the given trainingssession. If list is empty, the trainingssession will be deleted
 * WARNING Keine Auth Check
 * @param {*} user 
 * @param {*} groupID 
 * @param {*} date 
 * @param {*} sessionBody 
 */
const runGarbageCollector = async (user, groupID, date, sessionBody = undefined) => {
    if (typeof sessionBody === 'undefined') {
        sessionBody = await getTrainingssession(user, groupID, date)
    }

    if (!sessionBody.participants.some(participant => participant.attended === true)) {
        logger.debug('Garbage Collector - Trainingssession: Deleted a trainingssession')
        await deleteTrainingssession(user, groupID, date)
    } else {
        logger.debug('Garbage Collector - Trainingssession: No trainingssession deleted')
    }
}

/**
 * Delete a attendance list
 * @param attendanceID
 * @returns {Promise<Attendance>}
 */
//WARNING Wird nicht genutzt --> Kann gelöscht werden
// const deleteAttendance = async (user, attendanceID) => {
//     if (user.roles.includes('admin') || (user.roles.includes('trainer') && user.accessible_groups.includes(groupID))) {
//         return Attendance.findByIdAndDelete(attendanceID)
//     } else {
//         throw new ApiError(httpStatus.FORBIDDEN, "The user is not permitted to delete a attendance list")
//     }
// };

/**
 * Delete a trainings session
 * @param attendanceID
 * @returns {Promise<Attendance>}
 */
const deleteTrainingssession = async (user, groupID, date) => {
    if (hasAccessToGroup(user, groupID)) {
        return await Attendance.findOneAndUpdate({ 'group._id': groupID, }, { '$pull': { 'trainingssessions': { 'date': date } } })
    } else {
        throw new ApiError(httpStatus.UNAUTHORIZED, "The user's role has no access to attendance lists")
    }
};

/**
 * Get all Trainingssessions in Date Range
 */
const getTrainingssessionsByDateRange = async (user, groupID, startdate, enddate) => {
    //INFO Access control by getAttendanceByGroup()
    const list = await getAttendanceByGroup(user, groupID)
    let temp = {}
    temp.group = list.group

    temp.trainingssessions = list.trainingssessions.filter((e) => {
        if (e.date >= new Date(startdate) && e.date <= new Date(enddate)) {
            return e
        }
    })

    return temp
}

module.exports = {
    getAttendance,
    getAttendanceByGroup,
    updateTrainingssession,
    createAttendance,
    getTrainingssession,
    deleteTrainingssession,
    getTrainingssessionsByDateRange,
    runGarbageCollector
};
