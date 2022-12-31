const mongoose = require('mongoose')
const { toJSON, paginate } = require('./plugins')
const { Schema } = require("mongoose");
const { required } = require('joi');

const invoiceSchema = mongoose.Schema(
    {
        department: {
            type: {
                name: String
            },
            required: true
        },
        startdate: {
            type: Date,
            required: true
        },
        enddate: {
            type: Date,
            required: true
        },
        group: {
            type: [
                {
                    asssistent: Array,
                    department: {
                    type: {
                        name: String
                    }
                    },
                    name: {
                        type: String,
                        required: true,
                    },
                    times: Array,
                    trainer: Array,
                    trainingssessions: {
                        type: [
                            {
                                date: Date,
                                starttime: String,
                                endtime: String,
                                groupID: mongoose.Types.ObjectId,
                                length: Number,
                                participantCount: Number,
                                venue: String,
                                weekday: String
                            }
                           ],
                        required: true
                    },
                    venue: String
                }
            ],
            required: true
        },
        totalHours: Number,
        userInfo: {
            type: {
                userID: mongoose.Types.ObjectId,
                firstname: String,
                lastname: String,
                email: String,
            },
            required: true
        },
        submittedBy: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        status: {
            type: String,
            required: true,
            default: "pending"
        },
        assignedTo: {
            type: [mongoose.Types.ObjectId],
            required: false
        },
        reviewer: {
            type: mongoose.Types.ObjectId,
            required: false
        },
        dateOfReceipt: {
            type: Date,
            required: true,
            default: new Date()
        },
        dateOfLastChange: {
            type: Date,
            required: false
        }
    }
);

// add plugin that converts mongoose to json
invoiceSchema.plugin(toJSON)
invoiceSchema.plugin(paginate);

/**
 * @typedef Invoice
 */
const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;