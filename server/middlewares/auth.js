const jwt = require("jsonwebtoken");
const { tokenService, userService } = require("../services");

const config = require('../config/config');
const logger = require("../config/logger");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const verifyToken = async (req, res, next) => {
  let access_token = req.cookies.access_token;
  let refresh_token = req.cookies.refresh_token;

  try {
    //Wenn kein Access Token vorhanden ist
    if (!access_token) {
      //Wenn ein Refresh Token vorhanden ist
      if (refresh_token) {
        //Refresh Token wird überprüft
        refresh_token = await tokenService.verifyToken(refresh_token)

        //Wenn der Refresh Token gültig ist, wird ein neuer Access Token generiert
        const accessTokenExpires = new Date().getTime() + config.jwt.accessExpirationMinutes * 60 * 1000;
        access_token = await tokenService.generateToken(refresh_token.user, accessTokenExpires, "access")

      //Neuer Access Token wird an res als Cookie gehängt
        res.cookie("access_token", access_token, {
          expires: new Date(Date.now() + 15 * 60 * 1000),
          secure: true,
          httpOnly: true,
          sameSite: config.sameSite,
        })
      } else {
        clearCookie(res)
        return res.status(httpStatus.UNAUTHORIZED).send('Logout')
      }
    }
  } catch (err) {
    logger.error(err.toString())
    clearCookie(res)
    return res.status(httpStatus.UNAUTHORIZED).send('Logout')
  }

  try {
    if (typeof access_token !== 'undefined') {
      const decrypt = jwt.verify(access_token, config.jwt.secret);
      req.user = await userService.getUserById(decrypt.sub)
      return next();
    }
    else {
      clearCookie(res)
      return res.status(httpStatus.UNAUTHORIZED).send('Logout')
    }
  } catch (err) {
    logger.error(err.toString())
    clearCookie(res)
    return res.status(httpStatus.UNAUTHORIZED).send('Logout')
  }
};

//Helper function, damit der Code lesbarer ist
const clearCookie = (res) => {
  res.clearCookie('access_token', {
    secure: true,
    httpOnly: true,
    sameSite: config.sameSite
  }).clearCookie('refresh_token', {
    secure: true,
    httpOnly: true,
    sameSite: config.sameSite
  })
}

module.exports = verifyToken;