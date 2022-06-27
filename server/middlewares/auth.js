const jwt = require("jsonwebtoken");
const { authenticationService } = require("../services");

const config = require('../config/config')

const verifyToken = async (req, res, next) => {
  let access_token = req.cookies.access_token;
  const refresh_token = req.cookies.refresh_token;

  //TODO Add automatic token refresh if access token is not send but refresh is

  if (!access_token) {
    if (refresh_token) {
      access_token = await getNewTokens(res, refresh_token)
    } else{
      return res.status(403).send("A token is required for authentication");
    }
  }

  try {
    const decrypt = jwt.verify(access_token, config.secret);
    req.userID = decrypt.user_id
    return next();
  } catch (err) {
    return res.status(500).json(err.toString());
  }
};

const getNewTokens = async (res, old_refresh_token) => {
  const decoded = jwt.decode(old_refresh_token)

  const secret = await authenticationService.getRefreshTokenSecret(decoded.user_id, decoded.token_id)


  if (typeof secret === 'undefined') {
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
      .status(403)
      .send("No a valid refresh token");
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
    
    console.log("Secret: ", secret)

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

    console.log('Refresh: ', refresh_token)

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

    console.log("Access: ", access_token)

    return access_token
  } catch (err) {
    console.error("Hier" + err)
    return res.status(500).json(err.toString());
  }
}

module.exports = verifyToken;