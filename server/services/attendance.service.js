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
 * Get a attendance list by date.
 * @param {Date} date
 * @returns {Promise<Attendance>}
 */
const getAttendanceByDate = async (date) => {
    const allAttendance = await getAttendance()
    for (const attendance of allAttendance) {
        for (const trainings of attendance.trainingssession) {
            //TODO Fix damit Trainings.date === date wird
            console.log(trainings.date)
            console.log(date)
            console.log(trainings.date == date)
            if(trainings.date === date){
                console.log("Hey")
                return attendance
            }
        }
    }
    return {error: "Not Found"}
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
 * Update a attendance list data
 * @param attendanceID
 * @param {Object} attendanceBody
 * @returns {Promise<Attendance>}
 */
const updateAttendance = async (attendanceID, attendanceBody) => {
    return Attendance.findByIdAndUpdate(attendanceID, attendanceBody)
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
    updateAttendance,
    deleteAttendance,
    getAttendanceByDate
};
