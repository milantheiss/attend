const mongoose = require('mongoose')
const { toJSON, paginate } = require('./plugins')
const AutoIncrement = require('mongoose-sequence')(mongoose);

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
        groups: {
            type: [
                {
                    // Ist embeded, da es ein Snapshot zu Erstellungszeitpunkt ist
                    asssistent: Array,
                    department: mongoose.Types.ObjectId,
                    name: {
                        type: String,
                        required: true,
                    },
                    times: Array,
                    trainers: Array,
                    trainingssessions: {
                        type: [
                            {
                                date: Date,
                                starttime: String,
                                endtime: String,
                                groupID: mongoose.Types.ObjectId,
                                totalHours: Number,
                                participantCount: Number,
                                venue: String,
                                weekday: String
                            }
                           ],
                        required: true
                    },
                    attendanceList: Object,
                    venue: String
                }
            ],
            required: true
        },
        totalHours: Number,
        //MOD userInfo entfernt
        submittedBy: {
            type: {
                userId: mongoose.Types.ObjectId,
                firstname: String,
                lastname: String,
                headerData: Object
            },
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
            type: {
                firstname: String,
                lastname: String,
                userId: mongoose.Types.ObjectId,
            },
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
        },
        invoiceNumber: {
            type: Number,
            required: false
        }
    }
);

// add plugin that converts mongoose to json
invoiceSchema.plugin(toJSON)
invoiceSchema.plugin(paginate);
invoiceSchema.plugin(AutoIncrement, {inc_field: 'invoiceNumber'});

/**
 * @typedef Invoice
 */
const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;