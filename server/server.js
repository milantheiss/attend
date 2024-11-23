const logger = require('./config/logger');
const mongoose = require('mongoose');
const app = require('./app')
const config = require('./config/config');
const https = require('https')
const fs = require('fs')
const { createCA, createCert } = require("mkcert");

let server;

mongoose.set('strictQuery', true);

if (config.env === 'production') {

    mongoose.connect(config.url, { dbName: 'data' }).then(() => {
        logger.info(`Connected to MongoDB at ${new Date().toLocaleString()}`);
        server = app.listen(8080, () => {
            logger.info(`Listening to port 8080`);
        });
    });

}

if (config.env === 'development') {

    const mkcert = async () => {
        const ca = await createCA({
            organization: "milantheiss",
            countryCode: "DE",
            state: "Hessia",
            locality: "Dieburg",
            validity: 365
        });

        const cert = await createCert({
            ca: { key: ca.key, cert: ca.cert },
            domains: ["127.0.0.1", "localhost", "192.168.178.130"],
            validity: 365
        });


        mongoose.connect(config.url, { dbName: 'data' }).then(() => {
            logger.info(`Connected to MongoDB at ${new Date().toLocaleString()}`);
            server = https.createServer({
                key: cert.key,
                cert: cert.cert,
            }, app)
                .listen(config.port, () => {
                    logger.info(`Listening to port ${config.port}`);
                });
        });
    }
    mkcert();
}

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