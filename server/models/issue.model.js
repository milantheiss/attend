const mongoose = require('mongoose')

const { toJSON, paginate } = require('./plugins')
const { Schema } = require("mongoose");

const issueSchema = mongoose.Schema(
    {
        tag: {
            type: String,
            required: true,
            trim: true,
        },
        date: {
            type: Date,
            required: true,
            default: new Date()
        },
        body: {
            type: Object,
            required: true
        }
    }
);

// add plugin that converts mongoose to json
issueSchema.plugin(toJSON);
issueSchema.plugin(paginate);

/**
 * @typedef Member
 */
const Issue = mongoose.model('Issues', issueSchema);

module.exports = Issue;
