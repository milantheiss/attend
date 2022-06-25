const logger = require('../config/logger')
const {authenticationService} = require('../services')
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


/**
 * Nimmt Login Daten an und versucht User einzuloggen.
 * Wenn successfull wird ein JWT Token returned
 * @param  {} req from POST
 * @returns On Success JWT Token
 */
const login = catchAsync(async (req, res) => {
    // Our login logic starts here
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            return res.status(400).send("All input is required");
        }

        // Validate if user exist in our database
        const user = await authenticationService.getUserByEmail(email);

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                config.secret,
                {
                    expiresIn: "2h",
                }
            );

            // save user token
            user.token = token;

            // user
            return res.status(200).send(user);
        }
        return res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err);
    }
});

module.exports = {
    login
}

