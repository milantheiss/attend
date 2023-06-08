const mongoose = require('mongoose')
const { toJSON, paginate } = require('./plugins');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema(
    {
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
            required: true,
            unique: true,
            validate(value) {
                if (!value.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
                    throw new Error('Email is invalid');
                }
            }
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
            // validate(value) {
            //     if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
            //         throw new Error('Password must contain at least one letter and one number');
            //     }
            // },
            private: true, // used by the toJSON plugin
        },
        refresh_tokens: {
            type: [
                {
                    secret: {
                        type: String
                    }
                }
            ],
            private: true
        },
        accessible_groups: {
            type: [mongoose.Types.ObjectId]
        },
        roles: {
            type: Array
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
        },
        deactivated: {
            //Wenn ein User deaktiviert ist, kann er sich nicht mehr einloggen
            type: Boolean,
            default: false,
            private: true
        }
    }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    if (user.deactivated) {
        throw new ApiError(401, 'User is deactivated')
    }
    return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

/**
 * @typedef Attendance
 */
const User = mongoose.model('user', userSchema);

module.exports = User;
