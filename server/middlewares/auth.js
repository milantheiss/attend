const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser')

cookieParser()

const config = process.env;

const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
  
    try { 
      const decrypt = jwt.verify(token, config.TOKEN_KEY);
      req.userID = decrypt.user_id
      return next();
    } catch (err) {
      return res.status(500).json(err.toString());
    }   
};

module.exports = verifyToken;