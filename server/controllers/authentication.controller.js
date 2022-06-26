const logger = require('../config/logger')
const { authenticationService } = require('../services')
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieParser = require('cookie-parser');
const { default: mongoose } = require('mongoose');

cookieParser()

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
            // Create access token
            const access_token = jwt.sign(
                { user_id: user._id, email: user.email},
                config.secret,
                {
                    expiresIn: "15min",
                }
            );

            //Neues refresh secret wird in User kreiiert

            const new_secret = require('crypto').randomBytes(256).toString('base64')
            const secret_id = new mongoose.Types.ObjectId()

            console.log(await authenticationService.addRefreshToken(user._id, {secret: new_secret, _id: secret_id}))

            // Create refresh token
            const refresh_token = jwt.sign(
                { user_id: user._id, email: user.email, token_id: secret_id},
                new_secret,
                {
                    expiresIn: "7d",
                }
            );
            
            const response = {
                email: user.email,
                access_token: access_token,
                refresh_token: refresh_token
            }

            // user
            return res.cookie('access_token', access_token, {
                expires: new Date(Date.now() + 600000),
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true
            })
            .cookie('refresh_token', refresh_token, {
                expires: new Date(Date.now() + 604800000),
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true
            })
            .status(200)
            .send(response)
        }
        return res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err);
    }
});

/**
 * Logget User aus. Hierzu wird Cookie im Client gelöscht
 * und Token invalidiert 
 * @param  {} 
 * @returns
 */
const logout = catchAsync(async (req, res) => {
    // Our login logic starts here
    try {

        // user
        return res.clearCookie('access_token').status(200).send("Successfully logged out")
    } catch (err) {
        console.log(err);
    }
});

module.exports = {
    login,
    logout
}

