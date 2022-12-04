const mongoose = require('mongoose')

const { toJSON, paginate } = require('./plugins')
const { Schema } = require("mongoose");

const memberSchema = mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
            trim: true,
        },
        lastname: {
            type: String,
            required: true,
            trim: true,
        },
        birthday: {
            type: Date,
            required: true
        },
        departments: {
            type: [mongoose.Types.ObjectId],
            required: false
        },
        groups: {
            type: [mongoose.Types.ObjectId],
            required: false
        }
    }
);

// add plugin that converts mongoose to json
memberSchema.plugin(toJSON);
memberSchema.plugin(paginate);

/**
 * @typedef Member
 */
const Member = mongoose.model('Members', memberSchema);

module.exports = Member;
