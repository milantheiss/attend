const httpStatus = require('http-status');
const { Attendance, User, Member } = require('../models');
const { groupService } = require('.');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');
const logger = require('../config/logger');
const { hasAdminRole, hasAccessToGroup } = require('../utils/roleCheck');

async function getTrainersOfGroup(trainers) {
    trainers = await Promise.all(trainers.map(async (trainer) => {
        const res = await User.findOne({ _id: trainer.userId }, { firstname: 1, lastname: 1, _id: 1 })
        try {
            trainer._doc.firstname = res.firstname;
            trainer._doc.lastname = res.lastname;
            trainer._doc._id = res._id;
        } catch (e) {
            logger.error(e)
        }
        return trainer;
    }));
    return trainers
}

async function getParticipantsOfGroup(participants) {
    participants = await Promise.all(participants.map(async (participant) => {
        const res = await Member.findOne({ _id: participant.memberId }, { firstname: 1, lastname: 1, _id: 1 })
        try {
            participant._doc.firstname = res.firstname;
            participant._doc.lastname = res.lastname;
            participant._doc._id = res._id;
        } catch (e) {
            logger.error(e, res)
        }
        return participant;
    }));
    return participants
}

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
        const list = await Attendance.find({ group: { $in: user.accessible_groups } })

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

    //Falls es noch gar keine Attendance gibt, 
    try {
        session = attendance.trainingssessions.find(element => element.date.toJSON() === new Date(date).toJSON())
    } catch { }

    if (typeof session === 'undefined' && session == null) {
        //Get Trainingssession schickt nur den Body zurück. Erstellt aber keine neue Trainingssession in DB
        //Update aufgerufen wird, kann dann der Body in DB erstellt werden --> Erzeugt weniger DB Calls und weniger Garbage

        let participants = []

        const group = await groupService.getGroupById(user, groupID)

        date = new Date(date)

        group.participants.forEach((participant) => {
            if (date >= participant.firsttraining) {
                participants.push({
                    attended: false,
                    memberId: participant.memberId
                })
            }
        })

        let trainers = []

        group.trainers.forEach(trainer => {
            trainers.push({
                attended: true,
                userId: trainer.userId
            })
        })

        const weekday = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

        //TODO Handle timeInfo undefined
        //Sucht die entsprechende Zeit für den Wochentag heraus.
        const timeInfo = group.times.find((val) => val.day === weekday[new Date(date).getDay()]);

        const starttime = timeInfo?.starttime ?? null;
        const endtime = timeInfo?.endtime ?? null;


        const sessionBody = {
            date: date,
            starttime: starttime,
            endtime: endtime,
            participants: participants,
            trainers: trainers
        }

        //INFO Hier kann nicht die normale Funktion engesetzt werden, da _doc nicht existiert. --> Nutzung von normaler Funktion führt zu Fehler

        sessionBody.participants = await Promise.all(sessionBody.participants.map(async (participant) => {
            const res = await Member.findOne({ _id: participant.memberId }, { firstname: 1, lastname: 1, _id: 1 })
            try {
                participant.firstname = res.firstname;
                participant.lastname = res.lastname;
                participant._id = res._id;
            } catch (e) {
                logger.error(e)
            }
            return participant;
        }));

        sessionBody.trainers = await Promise.all(sessionBody.trainers.map(async (trainer) => {
            const res = await User.findOne({ _id: trainer.userId }, { firstname: 1, lastname: 1, _id: 1 })
            trainer.firstname = res.firstname;
            trainer.lastname = res.lastname;
            trainer._id = res._id;
            return trainer;
        }));

        return sessionBody
    } else {
        session.trainers = await getTrainersOfGroup(session.trainers)

        session.participants = await getParticipantsOfGroup(session.participants)

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
            const res = await Attendance.findOne({ 'group': groupID })

            //Wenn noch keine Attendance Document existiert, ist _res null
            if (res !== null && typeof res !== 'undefined') {
                return res
            } else { //Erstellt neues Attendance Document
                return Attendance.create({
                    group: new mongoose.Types.ObjectId(groupID),
                    trainingssessions: []
                })
            }
        } catch (e) {
            console.log(e)
        }
    } else {
        throw new ApiError(httpStatus.UNAUTHORIZED, `The user has no access to attendance lists`)
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
        if (!sessionBody.date || !sessionBody.participants || !sessionBody.trainers) {
            throw new ApiError(httpStatus.BAD_REQUEST, "The body is missing required fields")
        }

        if (!await runGarbageCollector(user, groupID, new Date(date), sessionBody)) {
            const session = await getTrainingssession(user, groupID, new Date(date))

            //Gleicht updated SessionBody mit session in DB ab
            //SessionBody wird nicht direkt in DB übertrage, damit keine anderen Werte, außer attended verändert werden können.
            sessionBody.participants.forEach(participant => {
                const temp = session.participants.find(foo => foo.memberId == participant.memberId)
                //Es werden nur Teilnehmer, die in der DB existieren geupdatet. Um neue Participant hinzuzufügen, muss er erst hinzugefügt werden.
                if (typeof temp !== 'undefined') {
                    temp.attended = participant.attended
                }
            })

            sessionBody.trainers.forEach(trainer => {
                const temp = session.trainers.find(foo => foo.userId == trainer.userId)
                //Es werden nur Trainer, die in der DB existieren geupdatet. Um neue Trainer hinzuzufügen, muss er erst hinzugefügt werden.
                if (typeof temp !== 'undefined') {
                    temp.attended = trainer.attended
                }
            })

            session.starttime = sessionBody.starttime
            session.endtime = sessionBody.endtime

            let updatedSession
            //Wenn eine ganz neue Trainingssession erstellt werden muss
            if (typeof session._id === 'undefined') {
                updatedSession = (await Attendance.findOneAndUpdate({ group: groupID }, { $addToSet: { trainingssessions: session } }, { new: true })).trainingssessions.find(value => value.date.toJSON() === new Date(date).toJSON())
            } else {
                updatedSession = (await Attendance.findOneAndUpdate({ group: groupID, 'trainingssessions.date': date }, { '$set': { 'trainingssessions.$': session } }, { new: true })).trainingssessions.find(value => value.date.toJSON() === new Date(date).toJSON())
            }

            updatedSession.trainers = await getTrainersOfGroup(updatedSession.trainers)

            updatedSession.participants = await getParticipantsOfGroup(updatedSession.participants)

            return updatedSession
        } else {
            return await getTrainingssession(user, groupID, new Date(date))
        }
    } else {
        throw new ApiError(httpStatus.UNAUTHORIZED, "The user's role has no access to attendance lists")
    }
};

/**
 * Checks for the given trainingssession. If list is empty, the trainingssession will be deleted
 * @param {*} user 
 * @param {*} groupID 
 * @param {*} date 
 * @param {*} sessionBody 
 * @returns {Boolean} true if trainingssession was deleted
 */
const runGarbageCollector = async (user, groupID, date, sessionBody = undefined) => {
    if (typeof sessionBody === 'undefined') {
        sessionBody = await getTrainingssession(user, groupID, date)
    }

    //Garbage Collector nicht von Trainern abhängig, da Training stattfinden kann, ohne dass die eingetragenen Trainer anwesend sind
    //Jedoch nicht ohne Kinder
    if (!sessionBody.participants.some(participant => participant.attended === true)) {
        logger.debug('Garbage Collector - Trainingssession: Deleted a trainingssession')
        await deleteTrainingssession(user, groupID, date)
        return true
    } else {
        return false
    }
}

/**
 * Delete a trainings session
 * @param attendanceID
 * @returns {Promise<Attendance>}
 */
const deleteTrainingssession = async (user, groupID, date) => {
    if (hasAccessToGroup(user, groupID)) {
        return await Attendance.findOneAndUpdate({ group: groupID, }, { '$pull': { 'trainingssessions': { 'date': date } } })
    } else {
        throw new ApiError(httpStatus.UNAUTHORIZED, "The user's role has no access to attendance lists")
    }
};

/**
 * Get all Trainingssessions in Date Range
 * WARNING Es werden keine Teilnehmer oder Trainer Daten ergänzt
 */
const getTrainingssessionsByDateRange = async (user, groupID, startdate, enddate) => {
    //INFO Access control by getAttendanceByGroup()
    let list = await getAttendanceByGroup(user, groupID)

    list.trainingssessions = list.trainingssessions.filter((e) => (e.date >= new Date(startdate) && e.date <= new Date(enddate)))

    return list
}

/**
 * Returns all trainingssessions a trainer attended, in the required formate for pdf generation.
 * @param {*} user 
 * @param {*} groupID 
 * @param {*} startdate 
 * @param {*} enddate 
 * @returns Array
 */
const getDataForInvoice = async (user, groupID, startdate, enddate) => {
    let dataset = (await getTrainingssessionsByDateRange(user, groupID, startdate, enddate)).trainingssessions.filter((e) => {
        //Es werden nur Trainingssessions zurückgeben an denen der Trainer teilgenommen hat.
        if (e.trainers.some(e => e.userId.equals(user._id) && e.attended)) {
            //.trainers Property wird nicht mehr benötigt
            delete e._doc.trainers

            //Zählt wie viele Teilnehmer an der Trainingssession teilgenommen haben.
            e._doc.participantCount = e.participants.filter(e => e.attended).length

            //.participants Property wird nicht mehr gebraucht
            delete e._doc.participants

            return e
        }
    })

    dataset.sort((a, b) => (a.date > b.date) ? 1 : -1)

    return dataset
}

const getFormattedListForAttendanceListPDF = async (user, groupID, startdate, enddate) => {
    const result = await getTrainingssessionsByDateRange(user, groupID, startdate, enddate)

    let tempList = {
        dates: [],
        participants: []
    }

    for (session of result.trainingssessions) {

        tempList.dates.push(session.date)

        const participants = await getParticipantsOfGroup(session.participants)

        for (participant of participants) {
            const temp = tempList.participants.find(foo => foo.memberId.equals(participant.memberId))
            if (typeof temp === 'undefined') {
                tempList.participants.push({
                    memberId: participant._doc.memberId,
                    firstname: participant._doc.firstname,
                    lastname: participant._doc.lastname,
                    attendance: [{
                        date: session.date,
                        attended: participant._doc.attended
                    }]
                })
            } else {
                temp.attendance.push({
                    date: session.date,
                    attended: participant._doc.attended
                })
            }
        }
    }

    tempList.dates.sort((a, b) => a - b)
    tempList.participants.sort((a, b) => a.lastname.localeCompare(b.lastname))

    return tempList
}

const removeMemberFromAttendanceList = async (user, groupID, memberID) => {
    const attendance = await getAttendanceByGroup(user, groupID)

    attendance.trainingssessions.forEach(session => {
        session.participants = session.participants.filter(participant => !participant.memberId.equals(memberID))
    })

    //TODO Implement Garbage Collector

    await attendance.save()
}

const removeTrainerFromAttendanceList = async (groupID, trainerID) => {
    const attendance = await Attendance.findOne({ group: groupID })

    attendance.trainingssessions.forEach(session => {
        session.trainers = session.trainers.filter(trainer => !trainer.userId.equals(trainerID))
    })

    await attendance.save()
}


module.exports = {
    getAttendance,
    getAttendanceByGroup,
    updateTrainingssession,
    createAttendance,
    getTrainingssession,
    deleteTrainingssession,
    getTrainingssessionsByDateRange,
    runGarbageCollector,
    getDataForInvoice,
    getFormattedListForAttendanceListPDF,
    removeMemberFromAttendanceList,
    removeTrainerFromAttendanceList
};
