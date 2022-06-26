const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    
    //TODO Add automatic token refresh if access token is not send but refresh is

    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
  
    try { 
      const decrypt = jwt.verify(token, config.SECRET_KEY);
      req.userID = decrypt.user_id
      return next();
    } catch (err) {
      return res.status(500).json(err.toString());
    }   
};

module.exports = verifyToken;