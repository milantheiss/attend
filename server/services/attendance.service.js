const httpStatus = require('http-status');
const { Attendance, User, Member, Group } = require('../models');
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
    participants = participants.filter(participant => typeof participant._doc.firstname !== "undefined" && typeof participant._doc.lastname !== "undefined")
    return participants
}

/**
 * WARNING Wird nicht genutzt
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
const getTrainingssession = async (groupID, date) => {
    //INFO Access control wird von 'getAttendanceByGroup' gehandelt
    const attendance = await getAttendanceByGroup(groupID)

    //Falls es noch gar keine Attendance gibt, 
    session = attendance.trainingssessions.find(element => element.date.toJSON() === new Date(date).toJSON())

    if (typeof session === 'undefined' && session == null) {
        //Get Trainingssession schickt nur den Body zurück. Erstellt aber keine neue Trainingssession in DB
        //Update aufgerufen wird, kann dann der Body in DB erstellt werden --> Erzeugt weniger DB Calls und weniger Garbage

        let participants = []

        const group = await Group.findById(groupID)

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

        sessionBody.participants = sessionBody.participants.filter(participant => typeof participant.firstname !== "undefined" && typeof participant.lastname !== "undefined")

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
const getAttendanceByGroup = async (groupID) => {
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
};

/**
 * Create a Attendance List
 * @param {Object} attendanceBody
 * @returns {Promise<Attendance>}
 */
const createAttendance = async (groupID) => {
    return Attendance.create({
        group: groupID,
        trainingssessions: []
    })
};

/**
 * Update a trainings session. Wird nicht beim hinzufügen von neuen Member benutzt.
 * @param groupID
 * @param date
 * @param {Object} sessionBody The body muss include date: Date, participants: [Member]
 * @returns {Promise<Attendance>}
 */
const updateTrainingssession = async (groupID, date, sessionBody) => {
    const compareDates = (a, b) => {
        if (!(a instanceof Date) || !(b instanceof Date)) a = new Date(a), b = new Date(b)
        return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
    }

    //Wenn alle Teilnehmer nicht anwesend sind, wird die Trainingssession gelöscht
    if (!sessionBody.participants.some(p => p.attended)) {
        await deleteTrainingssession(groupID, date)
        return await getTrainingssession(groupID, date)
    }

    //Wenn mindestens ein Teilnehmer anwesend war

    const attendance = await getAttendanceByGroup(groupID)

    sessionBody.trainers = sessionBody.trainers.map(trainer => {
        return {
            attended: trainer.attended,
            userId: trainer.userId,
            _id: trainer.userId
        }
    })

    sessionBody.participants = sessionBody.participants.map(participant => {
        return {
            attended: participant.attended,
            memberId: participant.memberId,
            _id: participant.memberId
        }
    })

    //Wenn die Trainingssession noch nicht existiert, wird sie erstellt
    if (!attendance.trainingssessions.some(e => compareDates(e.date, new Date(sessionBody.date)))) {
        sessionBody.date = new Date(sessionBody.date)
        attendance.trainingssessions.push(sessionBody)
    } else {
        attendance._doc.trainingssessions = attendance.trainingssessions.map(e => {
            if (compareDates(e.date, new Date(sessionBody.date))) {
                sessionBody.date = e.date;
                return sessionBody
            }
            return e
        })
    }

    await attendance.save()

    return await getTrainingssession(groupID, date)
};

const removeDuplicates = async () => {
    const getDateString = (date) => {
        return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()
    }

    const attendances = await Attendance.find({})

    attendances.forEach(attendance => {
        const dates = new Set()
        attendance.trainingssessions.forEach(session => {
            if (dates.has(getDateString(session.date))) {
                attendance.trainingssessions.splice(attendance.trainingssessions.indexOf(session), 1)
            } else {
                dates.add(getDateString(session.date))
            }
        })
        attendance.save()
    })
    return;
}


/**
 * Checks for the given trainingssession. If list is empty, the trainingssession will be deleted
 * @param {*} user 
 * @param {*} groupID 
 * @param {*} date 
 * @param {*} sessionBody 
 * @returns {Boolean} true if trainingssession was deleted
 */
const runGarbageCollector = async (groupID) => {
    const attendance = await getAttendanceByGroup(groupID)

    attendance.trainingssessions = attendance.trainingssessions.filter(session => session.participants.some(p => p.attended))

    await attendance.save()
}

/**
 * Delete a trainings session
 * @param attendanceID
 * @returns {Promise<Attendance>}
 */
const deleteTrainingssession = async (groupID, date) => {
    const attendance = await getAttendanceByGroup(groupID)
    attendance.trainingssessions = attendance.trainingssessions.filter(e => e.date.toJSON() !== new Date(date).toJSON())

    await attendance.save()

    return attendance
};

/**
 * Get all Trainingssessions in Date Range
 * WARNING Es werden keine Teilnehmer oder Trainer Daten ergänzt
 */
const getTrainingssessionsByDateRange = async (groupID, startdate, enddate) => {
    let list = await getAttendanceByGroup(groupID)

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
const getDataForInvoice = async (userID, groupID, startdate, enddate) => {
    let dataset = (await getTrainingssessionsByDateRange(groupID, startdate, enddate)).trainingssessions.filter((e) => {
        //Es werden nur Trainingssessions zurückgeben an denen der Trainer teilgenommen hat.
        if (e.trainers.some(e => e.userId.equals(userID) && e.attended)) {
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

const getFormattedListForAttendanceListPDF = async (groupID, startdate, enddate) => {
    const result = await getTrainingssessionsByDateRange(groupID, startdate, enddate)

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

const removeMemberFromAttendanceList = async (groupID, memberID) => {
    const attendance = await getAttendanceByGroup(groupID)

    attendance.trainingssessions.forEach(session => {
        session.participants = session.participants.filter(participant => !participant.memberId.equals(memberID))
    })

    //Run Garbage Collector
    attendance.trainingssessions = attendance.trainingssessions.filter(session => session.participants.some(p => p.attended))

    await attendance.save()
}

const removeTrainerFromAttendanceList = async (groupID, trainerID) => {
    const attendance = await Attendance.findOne({ group: groupID })

    attendance.trainingssessions.forEach(session => {
        session.trainers = session.trainers.filter(trainer => !trainer.userId.equals(trainerID))
    })

    await attendance.save()
}

const updateMemberIdOfParticipant = async (groupID, newMemberID, oldMemberID) => {
    const attendance = await getAttendanceByGroup(groupID)

    attendance.trainingssessions.forEach(session => {
        //Die Teilnehmerliste wird durchgegangen und der alte MemberID durch die neue ersetzt
        //Wenn die neue ID bereits in der Liste ist, wird sie nicht nochmal hinzugefügt
        //Wenn attend beim alten Member true ist, wird es auch beim neuen Member true

        if (session.participants.some(participant => participant.memberId.equals(newMemberID))) {
            const keep = session.participants.find(participant => participant.memberId.equals(newMemberID))
            const old = session.participants.find(participant => participant.memberId.equals(oldMemberID))

            keep.attended = keep.attended || old.attended

            session.participants = session.participants.filter(participant => !participant.memberId.equals(oldMemberID))

            session.participants.find(participant => participant.memberId.equals(newMemberID));
        } else if (session.participants.some(participant => participant.memberId.equals(oldMemberID))) {
            session.participants.forEach(participant => {
                if (participant.memberId.equals(oldMemberID)) {
                    participant.memberId = newMemberID
                }
            })
        }
    })

    return await attendance.save()
}

const getStats = async (groupid, startdate, enddate, formate = "json") => {
    const attendance = await getAttendanceByGroup(groupid);

    let totalSessions = 0;
    const statsParticipants = new Map();
    const statsTrainers = new Map();

    attendance.trainingssessions.forEach((session) => {
        if (session.date >= new Date(startdate) && session.date <= new Date(enddate)) {
            session.participants.forEach(participant => {
                if (participant.attended) {
                    if (statsParticipants.has(participant.memberId.toString())) {
                        statsParticipants.set(participant.memberId.toString(), statsParticipants.get(participant.memberId.toString()) + 1)
                    } else {
                        statsParticipants.set(participant.memberId.toString(), 1)
                    }
                }
            })
            session.trainers.forEach(trainer => {
                if (trainer.attended) {
                    if (statsTrainers.has(trainer.userId.toString())) {
                        statsTrainers.set(trainer.userId.toString(), statsTrainers.get(trainer.userId.toString()) + 1)
                    } else {
                        statsTrainers.set(trainer.userId.toString(), 1)
                    }
                }
            })

            totalSessions++
        }
    })


    const members = await Member.find({ _id: { $in: Array.from(statsParticipants.keys()) } }, { _id: 1, firstname: 1, lastname: 1 })
    const trainers = await User.find({ _id: { $in: Array.from(statsTrainers.keys()) } }, { _id: 1, firstname: 1, lastname: 1 })

    const resMembers = members.map(member => {
        return {
            firstname: member.firstname,
            lastname: member.lastname,
            attendance: statsParticipants.get(member._id.toString())
        }
    })

    resMembers.sort((a, b) => a.lastname.localeCompare(b.lastname))

    const resTrainers = trainers.map(trainer => {
        return {
            firstname: trainer.firstname,
            lastname: trainer.lastname,
            attendance: statsTrainers.get(trainer._id.toString())
        }
    })

    resTrainers.sort((a, b) => a.lastname.localeCompare(b.lastname))

    if (formate === "csv") {
        const fields = ['lastname', 'firstname', 'attendance']
        let csv = [fields, ...resMembers.map(e => [e.lastname, e.firstname, e.attendance])].map(e => e.join(",")).join("\n")
        csv += "\n\n"
        csv += resTrainers.map(e => [e.lastname, e.firstname, e.attendance]).map(e => e.join(",")).join("\n")
        csv += "\n\n" + `Total Sessions,${totalSessions}`
        return csv
    }

    return {
        totalSessions: totalSessions,
        members: resMembers,
        trainers: resTrainers
    }
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
    removeTrainerFromAttendanceList,
    updateMemberIdOfParticipant,
    removeDuplicates,
    getStats
};
