const mongoose = require('mongoose')
const { toJSON, paginate } = require('./plugins')
const { Schema } = require("mongoose");

const groupSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        participants: {
            type: [
                {
                    firstname: {
                        type: String,
                        required: true,
                        trim: true
                    },
                    lastname: {
                        type: String,
                        required: true,
                        trim: true
                    },
                    birthday: {
                        type: Date,
                        required: false,
                    }
                }
            ],
            required: false,
        },
        trainer: {
            type: [
                {
                    name: {
                        type: String,
                        required: true,
                        trim: true
                    }
                }
            ],
            required: true
        },
        assistent: {
            type: [
                {
                    name: {
                        type: String,
                        required: true,
                        trim: true
                    }
                }
            ],
            required: false
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
            ]
        },
        venue: {
            type: String,
            required: false,
            trim: true
        },
        department: {
            type: {
                name: {
                    type: String,
                    required: true,
                    trim: true
                }
            },
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
