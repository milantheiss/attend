const Joi = require('joi');

const addMember = {
  params: Joi.object().keys({
    //String als ObjectId
    groupID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  }),
  body: Joi.object().keys({
    //String als ObjectId
    groupID: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    //String darf nur aus Groß- & Kleinbuchstaben, Bindestrichen und Leerzeichen bestehen
    memberId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    //Datum als String im Format YYYY-MM-DD sein
    firsttraining: Joi.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/).required(),
    //Array aus ObjectIds Not required
    openIssues: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  })
};

const updateMember = {
  params: Joi.object().keys({
    //String als ObjectId
    groupID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  }),
  body: Joi.object().keys({
    //String als ObjectId
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    //String darf nur aus Groß- & Kleinbuchstaben, Bindestrichen und Leerzeichen bestehen
    memberId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    //Datum als String im Format YYYY-MM-DD sein
    firsttraining: Joi.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/).required(),
    //Array aus ObjectIds Not required
    openIssues: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  })
};

const createGroup = {
  body: Joi.object().keys({
    //String darf nur aus Groß- & Kleinbuchstaben, Bindestrichen und Leerzeichen bestehen
    name: Joi.string().pattern(/^[a-zA-Z- ]+$/).required(),
    //Array aus ObjectIds Not required
    times: Joi.array().items(Joi.object().keys({
      //String darf nur aus Groß- & Kleinbuchstaben, Bindestrichen und Leerzeichen bestehen
      day: Joi.string().pattern(/^[a-zA-Z- ]+$/).required(),
      //String im Format HH:MM sein Nur 24h Format Nur Zahlen
      starttime: Joi.string().regex(/^[0-9]{2}:[0-9]{2}$/).required(),
      //String im Format HH:MM sein Nur 24h Format Nur Zahlen
      endtime: Joi.string().regex(/^[0-9]{2}:[0-9]{2}$/).required(),
    })).required(),
    //String darf nur aus Groß- & Kleinbuchstaben, Bindestrichen und Leerzeichen bestehen
    venue: Joi.string().pattern(/^[a-zA-Z- ]+$/).required(),
    //Array aus ObjectIds Required
    departments: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).required()
  })
};

const updateGroup = {
  params: Joi.object().keys({
    //String als ObjectId
    groupID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  }),
  body: Joi.object().keys({
    //String darf nur aus Groß- & Kleinbuchstaben, Bindestrichen und Leerzeichen bestehen
    name: Joi.string().pattern(/^[a-zA-Z- ]+$/),
    //Array aus ObjectIds Not required
    participants: Joi.array().items(Joi.object().keys({
      //String als ObjectId
      memberId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
      //Datum als String im Format YYYY-MM-DD sein
      firsttraining: Joi.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/).required(),
      //Array aus ObjectIds Not required
      openIssues: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
    })),
    //Array aus ObjectIds Not required
    trainers: Joi.array().items(Joi.object().keys({
      //String als ObjectId
      userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
      //String darf nur aus Groß- & Kleinbuchstaben, Bindestrichen und Leerzeichen bestehen
      role: Joi.string().pattern(/^[a-zA-Z- ]+$/).required(),
    })),
    //Array aus ObjectIds Not required
    times: Joi.array().items(Joi.object().keys({
      //String darf nur aus Groß- & Kleinbuchstaben, Bindestrichen und Leerzeichen bestehen
      day: Joi.string().pattern(/^[a-zA-Z- ]+$/).required(),
      //String im Format HH:MM sein Nur 24h Format Nur Zahlen
      starttime: Joi.string().regex(/^[0-9]{2}:[0-9]{2}$/).required(),
      //String im Format HH:MM sein Nur 24h Format Nur Zahlen
      endtime: Joi.string().regex(/^[0-9]{2}:[0-9]{2}$/).required(),
    })),
    //String darf nur aus Groß- & Kleinbuchstaben, Bindestrichen und Leerzeichen bestehen
    venue: Joi.string().pattern(/^[a-zA-Z- ]+$/),
    //Array aus ObjectIds Required
    department: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
  })
};

const getGroupById = {
  params: Joi.object().keys({
    //String als ObjectId
    groupID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  })
};

const removeMember = {
  params: Joi.object().keys({
    //String als ObjectId
    memberID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    //String als ObjectId
    groupID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  })
};

const removeTrainer = {
  params: Joi.object().keys({
    //String als ObjectId
    userID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    //String als ObjectId
    groupID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  })
};

const addTrainer = {
  params: Joi.object().keys({
    //String als ObjectId
    groupID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  }),
  body: Joi.object().keys({
    //String als ObjectId
    userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    //String der Rolle es kann entweder trainer oder assistant sein
    role: Joi.string().valid('trainer', 'assistant').required()
  })
};

module.exports = {
  addMember,
  createGroup,
  getGroupById,
  removeMember,
  updateGroup,
  updateMember,
  removeTrainer,
  addTrainer
};