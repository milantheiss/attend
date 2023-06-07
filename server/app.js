const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const httpStatus = require('http-status');

const { errorConverter, errorHandler } = require('./middlewares/error');
const cookieParser = require('cookie-parser')
const ApiError = require('./utils/ApiError');
const routes = require('./routes');

const xss = require("./middlewares/xss-clean")
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');

/*
const { authLimiter } = require('./middlewares/rateLimiter');
const passport = require('passport');
const { jwtStrategy } = require('./config/passport');
*/

const app = express();


// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors({
    credentials: true,
    origin: config.origin
}));

// enable cookie parsing
app.use(cookieParser())

/*
// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
    app.use('/auth', authLimiter);
}
*/

// Define routes
app.use('/', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app
