const mongoose = require('mongoose')
const {toJSON, paginate} = require('./plugins')
const {Schema} = require("mongoose");

const groupSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        participants: {
            type: [Schema.ObjectId],
            required: false,
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
