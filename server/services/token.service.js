const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { Token } = require('../models');

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(new Date(expires).getTime() / 1000),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Date} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token, userId, expires, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires,
    blacklisted,
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @returns {Promise<Token>}
 */
const verifyToken = async (token) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({ token, user: payload.sub, blacklisted: false });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
  const accessTokenExpires = new Date().getTime() + config.jwt.accessExpirationMinutes * 60 * 1000;
  const accessToken = generateToken(user.id, accessTokenExpires, "access");

  const refreshTokenExpires = new Date().getTime() + config.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000;
  const refreshToken = generateToken(user.id, refreshTokenExpires, "refresh");
  await saveToken(refreshToken, user.id, refreshTokenExpires);

  return {
    access: accessToken,
    refresh: refreshToken,
  };
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens
};