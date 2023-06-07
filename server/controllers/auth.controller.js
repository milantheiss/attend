const logger = require("../config/logger");
const { authenticationService, authService, tokenService, userService } = require("../services");
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const config = require("../config/config");

const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

/**
 * Nimmt Login Daten an und versucht User einzuloggen.
 * Wenn successfull wird ein JWT Token returned
 * @param  {} req from POST
 * @returns On Success JWT Token
 */
const login = catchAsync(async (req, res) => {
    // Get user input
    const { email, password } = req.body;

    // Validate if user exist in our database
    const user = await authService.loginUserWithEmailAndPassword(email, password);

    // Create access token

    const tokens = await tokenService.generateAuthTokens(user);


    const response = {
        user: {
            firstname: user.firstname,
            lastname: user.lastname,
            _id: user._id,
            lengthAccessibleGroups: user.accessible_groups.length,
            roles: user.roles,
            email: user.email
        },
        showPatchNotesDialog: !user.readPatchnotes,
    };

    logger.debug("Successfull Login");

    // user
    //TODO Update mit Time aus env

    return res
        .cookie("access_token", tokens.access, {
            expires: new Date(Date.now() + 15 * 60 * 1000),
            secure: true,
            httpOnly: true,
            sameSite: config.sameSite,
        })
        .cookie("refresh_token", tokens.refresh, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            secure: true,
            httpOnly: true,
            sameSite: config.sameSite,
        })
        .status(httpStatus.OK)
        .send(response);
});

/**
 * Logget User aus. Hierzu wird Cookie im Client gelöscht
 * und Token invalidiert
 * @param  {}
 * @returns
 */
const logout = catchAsync(async (req, res) => {
    try {
        //TODO Im Frontend implementieren
        const refresh_token = req.cookies.refresh_token;

        if (!refresh_token) {
            return res.status(httpStatus.BAD_REQUEST).send("No refresh token given");
        }

        await authService.logout(refresh_token);

        return res
            .clearCookie("access_token", {
                secure: true,
                httpOnly: true,
                sameSite: config.sameSite,
            })
            .clearCookie("refresh_token", {
                secure: true,
                httpOnly: true,
                sameSite: config.sameSite,
            })
            .status(httpStatus.NO_CONTENT)
            .send();
    } catch (err) {
        logger.error(err);
    }

});

module.exports = {
    login,
    logout
};
