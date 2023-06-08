const Joi = require('joi');

const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const updatePassword = {
    body: Joi.object().keys({
        old: Joi.string().required(),
        new: Joi.string().min(8).required(),
    }),
}

const resendPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

module.exports = {
  login,
  updatePassword,
  resendPassword,
};