// Importing required modules
const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const routes = require('./routes');
const httpStatus = require('http-status');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

const app = express();

// Configure middlewares

// parse json request body
app.use(express.json());
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options('*', cors());

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
