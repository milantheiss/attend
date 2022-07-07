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
        SECRET_KEY: Joi.string().required().description('Secret key for JWT')
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
    sameSite: envVars.NODE_ENV === "production" ? 'Lax' : 'None'
};
