const mongoose = require('mongoose')
const { toJSON, paginate } = require('./plugins')
const { Schema } = require("mongoose");

const groupSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        participants: {
            type: [
                {
                    memberId: {
                        type: mongoose.Types.ObjectId,
                        required: true
                    },
                    firsttraining: {
                        type: Date,
                        required: true
                    }
                }
            ],
            required: false
        },
        trainers: {
            type: [
                {
                    userId: {
                        type: mongoose.Types.ObjectId,
                        required: true
                    },
                    role: {
                        type: String,
                        required: true,
                        trim: true
                    }
                }
            ],
            required: true
        },
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
            ],
            required: true
        },
        venue: {
            type: String,
            required: false,
            trim: true
        },
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
