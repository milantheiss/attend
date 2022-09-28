const mongoose = require('mongoose')

const { toJSON, paginate } = require('./plugins')

const attendanceSchema = mongoose.Schema(
    {
        group: {
            type: {
                name: {
                    type: String,
                    required: true
                }
            },
            required: false
        },
        trainingssessions: {
            type: [
                {
                    date: {
                        type: Date,
                        required: true
                    },
                    participants: {
                        type: [
                            {
                                firstname: {
                                    type: String,
                                    required: true
                                },
                                lastname: {
                                    type: String,
                                    required: false
                                },
                                attended: {
                                    type: Boolean,
                                    required: true
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
