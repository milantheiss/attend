const mongoose = require('mongoose')

const { toJSON, paginate } = require('./plugins')

const userSchema = mongoose.Schema(
    {   
        username: {
            type: String,
            required: true,
            unique: true
        },
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
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
        access: {
            type: [
                {
                    tag: {
                        type: String,
                        required: true
                    }
                }
            ]
        },
        role: {
            type: String
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
