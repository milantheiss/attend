const mongoose = require('mongoose')

const { toJSON, paginate } = require('./plugins')

const userSchema = mongoose.Schema(
    {
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
        token: {
            type: String
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
