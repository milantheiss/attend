const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    let token

    if (typeof req.headers['authorization'] === 'undefined') {
        return res.status(403).send("A token is required for authentication");
    } else {
        token = (req.headers['authorization'].replace('Bearer ', ''));
    }

    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = verifyToken;