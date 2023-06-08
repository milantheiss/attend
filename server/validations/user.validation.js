const Joi = require('joi');

const updateUser = {
  params: Joi.object().keys({
    //String as ObjectId is required when id is not given in body
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  }),
  body: Joi.object().keys({
    //Es sind alle Groß und Kleinbuchstaben erlaubt
    firstname: Joi.string().pattern(/^[a-zA-ZäöüÄÖÜß-\s]+$/),
    //String darf nur aus Groß- & Kleinbuchstaben, Bindestrichen und Leerzeichen bestehen
    lastname: Joi.string().pattern(/^[a-zA-ZäöüÄÖÜß-\s]+$/),
    //
    email: Joi.string().email(),
    //String als ObjectId
    _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    //Array aus Strings Kann "admin", "staff", "head", "trainer" & "assistant" enthalten
    roles: Joi.array().items(Joi.string().valid("admin", "staff", "head", "trainer", "assistant")),
    //Array aus ObjectIds
    accessible_groups: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
  })
};

const createUser = {
  body: Joi.object().keys({
    //Es sind alle Groß und Kleinbuchstaben erlaubt
    firstname: Joi.string().pattern(/^[a-zA-ZäöüÄÖÜß-\s]+$/).required(),
    //String darf nur aus Groß- & Kleinbuchstaben, Bindestrichen und Leerzeichen bestehen
    lastname: Joi.string().pattern(/^[a-zA-ZäöüÄÖÜß-\s]+$/).required(),
    email: Joi.string().email().required(),
    //Array aus Strings Kann "admin", "staff", "head", "trainer" & "assistant" enthalten
    roles: Joi.array().items(Joi.string().valid("admin", "staff", "head", "trainer", "assistant")).required()
  })
};

const deleteUser = {
  params: Joi.object().keys({
    //String als ObjectId
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  })
};

const getUserById = {
  params: Joi.object().keys({
    //String als ObjectId
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  })
};

const resendPassword = {
  params: Joi.object().keys({
    //String als ObjectId
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  })
};

const updateSelf = {
  body: Joi.object().keys({
    //Es sind alle Groß und Kleinbuchstaben erlaubt
    firstname: Joi.string().pattern(/^[a-zA-ZäöüÄÖÜß-\s]+$/),
    //String darf nur aus Groß- & Kleinbuchstaben, Bindestrichen und Leerzeichen bestehen
    lastname: Joi.string().pattern(/^[a-zA-ZäöüÄÖÜß-\s]+$/),
    //
    email: Joi.string().email(),
    //WARNING: Rest wird entfernt
    //String als ObjectId
    _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).strip(),
    //Array aus Strings Kann "admin", "staff", "head", "trainer" & "assistant" enthalten
    roles: Joi.array().items(Joi.string().valid("admin", "staff", "head", "trainer", "assistant")).strip(),
    //Array aus ObjectIds
    accessible_groups: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).strip(),
  })
};

module.exports = {
  updateUser,
  createUser,
  deleteUser,
  getUserById,
  resendPassword,
  updateSelf
};