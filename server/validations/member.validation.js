const Joi = require('joi');

const updateMember = {
  body: Joi.object().keys({
    //Es sind alle Groß und Kleinbuchstaben erlaubt
    firstname: Joi.string().pattern(/^[a-zA-Z- ]+$/).required(),
    //String darf nur aus Groß- & Kleinbuchstaben, Bindestrichen und Leerzeichen bestehen
    lastname: Joi.string().pattern(/^[a-zA-Z- ]+$/).required(),
    //Datum als String im Format YYYY-MM-DD sein
    birthday: Joi.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/).required(),
    //Array aus ObjectIds Not required
    groups: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
    //String als ObjectId
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    //Array aus ObjectIds Not required
    openIssues: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
    //Array aus ObjectIds Not required Can be empty
    departments: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
  })
};

const createMember = {
  body: Joi.object().keys({
    //Firstname darf nur aus Groß- & Kleinbuchstaben, Bindestrichen und Leerzeichen bestehen
    firstname: Joi.string().pattern(/^[a-zA-Z- ]+$/).required(),
    //Lastname darf nur aus Groß- & Kleinbuchstaben, Bindestrichen und Leerzeichen bestehen
    lastname: Joi.string().pattern(/^[a-zA-Z- ]+$/).required(),
    //Birthday muss ein Datumstring im Format YYYY-MM-DD sein
    birthday: Joi.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/).required(),
  })
};

const deleteMember = {
  params: Joi.object().keys({
    //String als ObjectId
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  })
};

module.exports = {
  updateMember,
  createMember,
  deleteMember
};