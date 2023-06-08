const mongoose = require('mongoose')
const { toJSON, paginate } = require('./plugins')
const { Schema } = require("mongoose");

const departmentSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        head: {
            type: [mongoose.Types.ObjectId],
            required: true
        }
    }
);

// add plugin that converts mongoose to json
departmentSchema.plugin(toJSON)
departmentSchema.plugin(paginate);

/**
 * @typedef Department
 */
const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;
