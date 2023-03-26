const mongoose = require('mongoose')
const { toJSON, paginate } = require('./plugins')
const { Schema } = require("mongoose");

const groupSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        participants: {
            type: [
                {
                    // INFO memberId muss im Updater aus _id gezogen werden
                    // INFO _id muss im Updater für embedded Object gelöscht werden
                    memberId: {
                        type: mongoose.Types.ObjectId,
                        required: true
                    },

                    // INFO Das muss im Updater gelöscht werden                    
                    firstname: {
                        type: String,
                        required: false,
                        trim: true
                    },
                    lastname: {
                        type: String,
                        required: false,
                        trim: true
                    },
                    birthday: {
                        type: Date,
                        required: false
                    },

                    firsttraining: {
                        type: Date,
                        required: true
                    },
                    openIssue: {
                        type: mongoose.Types.ObjectId,
                        required: false
                    }
                }
            ],
            required: false
        },
        // INFO Manuell zu trainers umbenennen
        trainers: {
            type: [
                {
                    // INFO userId muss im Updater aus _id gezogen werden
                    // INFO _id muss im Updater für embedded Object gelöscht werden
                    userId: {
                        type: mongoose.Types.ObjectId,
                        required: true
                    },

                    // INFO Das muss im Updater gelöscht werden

                    firstname: {
                        type: String,
                        required: false,
                        trim: true
                    },
                    lastname: {
                        type: String,
                        required: false,
                        trim: true
                    },
                    name: {
                        type: String,
                        required: false,
                        trim: true
                    },

                    position: {
                        type: String,
                        required: true,
                        trim: true
                    }
                }
            ],
            required: true
        },

        // INFO assistent manuell löschen

        times: {
            type: [
                {
                    day: {
                        type: String,
                        required: true,
                        trim: true
                    },
                    starttime: {
                        type: String,
                        required: true,
                        trim: true
                    },
                    endtime: {
                        type: String,
                        required: true,
                        trim: true
                    }
                }
            ]
        },
        venue: {
            type: String,
            required: false,
            trim: true
        },
        // INFO Kann manuell geändert werden
        department: {
            type: mongoose.Types.ObjectId,
            required: true
        }
    }
);

// add plugin that converts mongoose to json
groupSchema.plugin(toJSON)
groupSchema.plugin(paginate);

/**
 * @typedef Group
 */
const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
