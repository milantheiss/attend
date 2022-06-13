const mongoose = require('mongoose')

const {toJSON, paginate} = require('./plugins')
const {Schema} = require("mongoose");

const attendanceSchema = mongoose.Schema(
    {
        group: {
            type: {
                name: {
                    type: String,
                    required: true
                },
                _id: {
                    type: Schema.ObjectId,
                    required: true
                }
            },
            required: false
        },
        trainingssession:{
            type: [
                {
                    date: {
                        type: Date,
                        required: true
                    },
                    participants:{
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
                                _id: {
                                    type: Schema.ObjectId,
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
        },

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
