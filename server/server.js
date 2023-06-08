const logger = require('./config/logger');
const mongoose = require('mongoose');
const app = require('./app')
const config = require('./config/config');
const https = require('https')
const fs = require('fs')

let server;

mongoose.set('strictQuery', true);

mongoose.connect(config.url, { dbName: 'data' }).then(() => {
    logger.info(`Connected to MongoDB at ${new Date().toLocaleString()}`);
    server = app.listen(8080, () => {
        logger.info(`Listening to port 8080`);
    });
    });

    const exitHandler = () => {
        if (server) {
            server.close(() => {
                logger.info('Server closed');
                process.exit(1);
            });
        } else {
            process.exit(1);
        }
    };

    const unexpectedErrorHandler = (error) => {
        logger.error(error);
        exitHandler();
    };

    process.on('uncaughtException', unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);

    process.on('warning', (warning) => {
        console.log(warning.stack);
    });

    process.on('SIGTERM', () => {
        logger.info('SIGTERM received');
        if (server) {
            server.close();
        }
    });
