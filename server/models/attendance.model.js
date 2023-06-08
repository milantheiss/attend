const mongoose = require('mongoose')

const { toJSON, paginate } = require('./plugins')

const attendanceSchema = mongoose.Schema(
    {
        group: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        trainingssessions: {
            type: [
                {
                    date: {
                        type: Date,
                        required: true
                    },
                    starttime: {
                        type: String,
                        required: true
                    },
                    endtime: {
                        type: String,
                        required: true
                    },
                    participants: {
                        type: [
                            {
                                memberId: {
                                    type: mongoose.Types.ObjectId,
                                    required: true
                                },
                                attended: {
                                    type: Boolean,
                                    required: true,
                                    default: false
                                }
                            }
                        ]
                    },
                    trainers: {
                        type: [
                            {
                                userId: {
                                    type: mongoose.Types.ObjectId,
                                    required: true
                                },
                                attended: {
                                    type: Boolean,
                                    required: true,
                                    default: true
                                }
                            }
                        ]
                    }
                }
            ]
        }
    }
);

// add plugin that converts mongoose to json
attendanceSchema.plugin(toJSON);
attendanceSchema.plugin(paginate);

/**
 * @typedef Attendance
 */
const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
