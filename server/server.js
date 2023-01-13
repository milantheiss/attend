const logger = require('./config/logger');
const mongoose = require('mongoose');
const app = require('./app')
const config = require('./config/config');
const https = require('https')
const fs = require('fs')

let server;
//config.mongoose.url

mongoose.set('strictQuery', true);

mongoose.connect(config.url, { dbName: 'data' }).then(() => {
    logger.info(`Connected to MongoDB at ${new Date().toLocaleString()}`);
    server = https.createServer({
        key: fs.readFileSync(config.key),
        cert: fs.readFileSync(config.cert),
    }, app)
        .listen(config.port, () => {
            logger.info(`Listening to port ${config.port}`);
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
