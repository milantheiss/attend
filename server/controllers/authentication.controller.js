const logger = require('../config/logger')
const { authenticationService } = require('../services')
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { default: mongoose } = require('mongoose');

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
        const { username, password } = req.body;

        // Validate user input
        if (!(username && password)) {
            return res.status(400).send("All input is required");
        }

        // Validate if user exist in our database
        const user = await authenticationService.getUserByUsername(username);

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create access token
            const access_token = jwt.sign(
                { user_id: user._id, username: user.username},
                config.secret,
                {
                    expiresIn: "15min",
                }
            );

            //Neues refresh secret wird in User kreiiert

            const new_secret = require('crypto').randomBytes(256).toString('base64')
            const secret_id = new mongoose.Types.ObjectId()

            await authenticationService.addRefreshToken(user._id, {secret: new_secret, _id: secret_id})

            // Create refresh token
            const refresh_token = jwt.sign(
                { user_id: user._id, username: user.username, token_id: secret_id},
                new_secret,
                {
                    expiresIn: "7d",
                }
            );
            
            const response = {
                username: user.username,
                user_id: user._id,
                access_token: access_token,
                refresh_token: refresh_token
            }

            logger.debug("Successfull Login")

            // user
            return res.cookie('access_token', access_token, {
                expires: new Date(Date.now() + 600000),
                secure: true,
                httpOnly: true,
                sameSite: 'Lax'
            }).cookie('refresh_token', refresh_token, {
                expires: new Date(Date.now() + 604800000),
                secure: true,
                httpOnly: true,
                sameSite: 'None'
            })
            .status(httpStatus.OK)
            .send(response)
        }
        return res.status(httpStatus.BAD_REQUEST).send("Invalid Credentials");
    } catch (err) {
        logger.error(err);
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
        const refresh_token = req.cookies.refresh_token

        const decoded = jwt.decode(refresh_token)

        try{
            authenticationService.deleteRefreshToken(decoded.user_id, decoded.token_id)
        }catch (err){
            //WARNING Es wird ein Error geworfen wenn z.B. kein Refresh Token übergeben wird
            //TODO Aufräum Methode implementieren, mit der alle Expired Refresh Tokenes gecleared werden
            logger.error("Server could not clear a refresh token because no token was send.")
        }
        
        logger.debug("Logged out")
        return res.clearCookie('access_token', {
            secure: true,
            httpOnly: true,
            sameSite: 'None'
        })
        .clearCookie('refresh_token', {
            secure: true,
            httpOnly: true,
            sameSite: 'None'
        })
        .status(httpStatus.OK)
        .send("Successfully logged out")
    } catch (err) {
        logger.error(err);
    }
});

module.exports = {
    login,
    logout
}

