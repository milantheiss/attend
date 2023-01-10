const mongoose = require('mongoose')
const { toJSON, paginate } = require('./plugins')
const { Schema } = require("mongoose");

const notificationSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        priority: {
            type: String,
            required: true,
            default: "normal"
        },
        from: {
            type: mongoose.Types.ObjectId,
            required: false
        },
        recipients: {
            type: [{
                userID: mongoose.Types.ObjectId,
                read: {
                    type: Boolean,
                    default: false,
                    required: true
                }
            }],
            default: [],
            required: true
        },
        message: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        data: {
            type: Object, 
            required:false
        },
        date: {
            type: Date,
            required: true,
            default: new Date()
        }
    }
);

// add plugin that converts mongoose to json
notificationSchema.plugin(toJSON)
notificationSchema.plugin(paginate);

/**
 * @typedef Notification
 */
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
