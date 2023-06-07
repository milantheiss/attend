const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../.env') });

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
        PORT: Joi.number().default(3000),
        ORIGIN_URL: Joi.string().required().description('Origin url for CORS'),
        MONGODB_URL: Joi.string().required().description('Mongo DB url'),
        KEY_PATH: Joi.string().required().description('Path to SSL Key'),
        CERT_PATH: Joi.string().required().description('Path to CERT'),
        SECRET_KEY: Joi.string().required().description('Secret key for JWT'),
        SMTP_HOST: Joi.string().description('server that will send the emails'),
        SMTP_PORT: Joi.number().description('port to connect to the email server'),
        SMTP_USERNAME: Joi.string().description('username for email server'),
        SMTP_PASSWORD: Joi.string().description('password for email server'),
        EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app')
    })
    .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    origin: envVars.ORIGIN_URL,
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    key: envVars.KEY_PATH,
    cert: envVars.CERT_PATH,
    secret: envVars.SECRET_KEY,
    sameSite: envVars.NODE_ENV === "production" ? 'Lax' : 'None',
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
};
