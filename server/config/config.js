const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../.env') });

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
        PORT: Joi.number().default(8080),
        MONGODB_URL: Joi.string().required().description('Mongo DB url'),
        KEY_PATH: Joi.string().description('Path to SSL Key'),
        CERT_PATH: Joi.string().description('Path to CERT'),
        SMTP_HOST: Joi.string().required().description('server that will send the emails'),
        SMTP_PORT: Joi.number().required().description('port to connect to the email server'),
        SMTP_USERNAME: Joi.string().required().description('username for email server'),
        SMTP_PASSWORD: Joi.string().required().description('password for email server'),
        EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
        JWT_SECRET: Joi.string().required().description('JWT secret key'),
        JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(15).description('minutes after which access tokens expire'),
        JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(7).description('days after which refresh tokens expire'),
        DOMAIN: Joi.string().required().description('Domain of the app for cookies'),
    })
    .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    key: envVars.KEY_PATH,
    cert: envVars.CERT_PATH,
    sameSite: 'Strict',
    domain: envVars.DOMAIN,
    email: {
        smtp: {
            host: envVars.SMTP_HOST,
            port: envVars.SMTP_PORT,
            auth: {
                user: envVars.SMTP_USERNAME,
                pass: envVars.SMTP_PASSWORD,
            },
        },
        from: envVars.EMAIL_FROM,
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    },
};
