const mongoose = require('mongoose')

const { toJSON, paginate } = require('./plugins');
const { boolean } = require('joi');

const userSchema = mongoose.Schema(
    {   
        username: {
            type: String,
            required: true,
            unique: true
        },
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        refresh_tokens: {
            type: [
                {
                    secret: {
                        type: String
                    }
                }
            ]
        },
        accessible_groups: {
            type: [mongoose.Types.ObjectId]
        },
        roles: {
            type: Array
        },
        readPatchnotes: {
            type: Boolean,
            default: true
        },
        headerData: {
            //Die Daten, werden im Header der Abrechnung genutzt
            type: {
                trainerId: {
                    type: String,
                    required: false,
                    unique: true
                },
                isTrainer: Boolean,
                hasLicense: Boolean,
                specialAgreement: Boolean,
                hasContract: Boolean,
                hasAgreedToCodeForChildrenWelfare: Boolean,
                hasSubmittedCriminalRecordCertificate: Boolean
            },
            required: false
        }
    }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * @typedef Attendance
 */
const User = mongoose.model('user', userSchema);

module.exports = User;
