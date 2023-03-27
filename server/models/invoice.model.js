const mongoose = require('mongoose')
const { toJSON, paginate } = require('./plugins')
const AutoIncrement = require('mongoose-sequence')(mongoose);

const invoiceSchema = mongoose.Schema(
    {
        department: {
            type: mongoose.Types.ObjectId,
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
                    trainer: Array,
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
                    // Embeded Attendance List muss geladen werden
                    // TODO: Embeded Attendance List muss geladen werden
                    attendanceList: Object,
                    venue: String
                }
            ],
            required: true
        },
        totalHours: Number,
        //MOD userInfo entfernt
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
invoiceSchema.plugin(AutoIncrement, {inc_field: 'invoiceNumber'});

/**
 * @typedef Invoice
 */
const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;