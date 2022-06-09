const mongoose = require('mongoose')

const { toJSON, paginate } = require('./plugins')
const {Schema} = require("mongoose");

const memberSchema = mongoose.Schema(
    {
        fristname: {
            type: String,
            required: true,
            trim: true,
        },
        lastname: {
            type: String,
            required: true,
            trim: true,
        },
        year: {
            type: Number,
            required: true
        },
        registeredGroups:{
            type: [Schema.ObjectId],
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
const Member = mongoose.model('Participant', memberSchema);

module.exports = Member;
