// Importing required util
const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const routes = require('./routes');
const httpStatus = require('http-status');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const logger = require('./config/logger');
const cookieParser = require('cookie-parser')

const app = express();

// enable cors
app.use(cors({
    credentials: true,
    origin: config.origin
}));
//app.options('*', cors());

// Configure middlewares

// parse json request body
app.use(express.json());
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cookie parsing
app.use(cookieParser())

// Defining route middleware
//TODO Routes wahrscheinlich richtig gesetzt
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
