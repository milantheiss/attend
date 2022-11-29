const mongoose = require('mongoose')
const { toJSON, paginate } = require('./plugins')
const { Schema } = require("mongoose");

const patchNotesSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        version: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        text: {
            type: String,
            required: true
        }
    }
);

// add plugin that converts mongoose to json
patchNotesSchema.plugin(toJSON)
patchNotesSchema.plugin(paginate);

/**
 * @typedef PatchNotes
 */
const PatchNotes = mongoose.model('PatchNotes', patchNotesSchema);

module.exports = PatchNotes;
