const jwt = require("jsonwebtoken");
const { authenticationService } = require("../services");

const config = require('../config/config');
const logger = require("../config/logger");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const verifyToken = async (req, res, next) => {
  let access_token = req.cookies.access_token;
  const refresh_token = req.cookies.refresh_token;

  if (!access_token) {
    if (refresh_token) {
      access_token = await getNewToken(req, res, refresh_token)
    } else {
      //TODO Hier auch auto redirect
      return res.clearCookie('access_token', {
        secure: true,
        httpOnly: true,
        sameSite: 'None'
      }).clearCookie('refresh_token', {
        secure: true,
        httpOnly: true,
        sameSite: 'None'
      }).status(httpStatus.UNAUTHORIZED).send({ redirect: '/logout' })
      //throw new ApiError(httpStatus.UNAUTHORIZED, "A token is required for authentication")
    }
  }

  try {
    if (typeof access_token !== 'undefined') {
      const decrypt = jwt.verify(access_token, config.secret);
      req.user = await authenticationService.getUserById(decrypt.user_id)
      return next();
    }
    else {
      return res
    }
  } catch (err) {
    logger.error(err.toString())
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Token is invalid")
  }
};

const getNewToken = async (req, res, old_refresh_token) => {
  const decoded = jwt.decode(old_refresh_token)

  const secret = await authenticationService.getRefreshTokenSecret(decoded.user_id, decoded.token_id)

  if (typeof secret === 'undefined') {
    res.clearCookie('access_token', {
      secure: true,
      httpOnly: true,
      sameSite: 'None'
    }).clearCookie('refresh_token', {
      secure: true,
      httpOnly: true,
      sameSite: 'None'
    }).status(403).send({ redirect: '/logout' })
    //TODO Auto redirect 
    return undefined
  }

  try {
    const decrypt = jwt.verify(old_refresh_token, secret)

    const access_token = jwt.sign(
      { user_id: decrypt.user_id, username: decrypt.username },
      config.secret,
      {
        expiresIn: "15min",
      }
    );

    await authenticationService.deleteRefreshToken(decrypt.user_id, decrypt.token_id)

    const new_secret = require('crypto').randomBytes(256).toString('base64')
    await authenticationService.addRefreshToken(decrypt.user_id, { secret: new_secret, _id: decrypt.token_id })

    // Create refresh token
    const refresh_token = jwt.sign(
      { user_id: decrypt.user_id, username: decrypt.username, token_id: decrypt.token_id },
      new_secret,
      {
        expiresIn: "7d",
      }
    );

    res.cookie('access_token', access_token, {
      expires: new Date(Date.now() + 600000),
      secure: true,
      httpOnly: true,
      sameSite: 'None'
    }).cookie('refresh_token', refresh_token, {
      expires: new Date(Date.now() + 604800000),
      secure: true,
      httpOnly: true,
      sameSite: 'None'
    })

    return access_token
  } catch (err) {
    logger.error(err.toString())
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Token is invalid")
  }
}

module.exports = verifyToken;