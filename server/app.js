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

const { authLimiter } = require('./middlewares/rateLimiter');

const app = express();


// parse json request body
// app.use(express.json());
app.use(express.json({ type: 'application/json', limit: '1mb' }));

// parse urlencoded request body
// app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));


// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
if (config.env === 'production') {
    app.use(cors({
        credentials: true,
        origin: [`https://${config.domain}`, `https://www.${config.domain}`, `https://www.attend.${config.domain}`, , `https://attend.${config.domain}`]
    }));
}

if (config.env === 'development') {
    app.use(cors({
        credentials: true,
        origin: [`https://${config.domain}:8080`]
    }));
}

// enable cookie parsing
app.use(cookieParser())

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
    app.use('/auth', authLimiter);
}

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
