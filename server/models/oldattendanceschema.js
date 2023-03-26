const mongoose = require('mongoose')

const { toJSON, paginate } = require('./plugins')

const attendanceSchema = mongoose.Schema(
    {
        group: {
            type: mongoose.Types.ObjectId,
            required: true,
            unique: true
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
                                // INFO userId muss im Updater aus _id gezogen werden
                                // INFO _id muss im Updater für embedded Object gelöscht werden
                                memberId: {
                                    type: mongoose.Types.ObjectId,
                                    required: true
                                },

                                // INFO Das muss im Updater gelöscht werden
                                firstname: {
                                    type: String,
                                    required: false
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
                    },
                    trainers: {
                        type: [
                            {
                                // INFO userId muss im Updater aus _id gezogen werden
                                // INFO _id muss im Updater für embedded Object gelöscht werden
                                userId: {
                                    type: mongoose.Types.ObjectId,
                                    required: true
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
