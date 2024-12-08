const Joi = require('joi');

const addMember = {
  params: Joi.object().keys({
    //String als ObjectId
    groupID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    memberID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  }),
  body: Joi.object().keys({
    //ObjectID als String
    memberId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    //Datum als String im Format YYYY-MM-DD sein
    firsttraining: Joi.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/).required(),
    _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    //WARNING Alle folgenden Felder werden entfernt
    //Array aus ObjectIds Not required
    openIssues: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).strip(),
    departments: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).strip(),
    groups: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).strip(),
    firstname: Joi.string().pattern(/^[a-zA-ZäöüÄÖÜß-\s]+$/).strip(),
    //String darf nur aus Groß- & Kleinbuchstaben, Bindestrichen und Leerzeichen bestehen
    lastname: Joi.string().pattern(/^[a-zA-ZäöüÄÖÜß-\s]+$/).strip(),
    birthday: Joi.string().strip()
  })
    .or('memberId', '_id')
};

const updateMember = {
  params: Joi.object().keys({
    //String als ObjectId
    groupID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    memberID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  }),
  body: Joi.object().keys({
    //String als ObjectId
    _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    //String darf nur aus Groß- & Kleinbuchstaben, Bindestrichen und Leerzeichen bestehen
    memberId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    //Datum als String im Format YYYY-MM-DD sein
    firsttraining: Joi.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/),
    firstname: Joi.string().pattern(/^[a-zA-ZäöüÄÖÜß-\s]+$/),
    //String darf nur aus Groß- & Kleinbuchstaben, Bindestrichen und Leerzeichen bestehen
    lastname: Joi.string().pattern(/^[a-zA-ZäöüÄÖÜß-\s]+$/),
    //Datum als String im Format YYYY-MM-DD sein
    birthday: Joi.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/),
    //WARNING Alle folgenden Felder werden entfernt
    departments: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).strip(),
    groups: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).strip(),
    openIssues: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).strip()
  })
};

const addMultipleMembers = {
  params: Joi.object().keys({
    //String als ObjectId
    groupID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  }),
  body: Joi.array().items(Joi.object().keys({
    //ObjectID als String
    memberId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    //Datum als String im Format YYYY-MM-DD sein
    firsttraining: Joi.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/).required(),
    _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    //WARNING Alle folgenden Felder werden entfernt
    //Array aus ObjectIds Not required
    openIssues: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).strip(),
    departments: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).strip(),
    groups: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).strip(),
    firstname: Joi.string().pattern(/^[a-zA-ZäöüÄÖÜß-\s]+$/).strip(),
    //String darf nur aus Groß- & Kleinbuchstaben, Bindestrichen und Leerzeichen bestehen
    lastname: Joi.string().pattern(/^[a-zA-ZäöüÄÖÜß-\s]+$/).strip(),

    birthday: Joi.string().strip(),
  })
    .or('memberId', '_id')
  )
};


const createGroup = {
  body: Joi.object().keys({
    //String darf nur aus Groß- & Kleinbuchstaben, Bindestrichen und Leerzeichen bestehen
    name: Joi.string().pattern(/^[a-zA-ZäöüÄÖÜß0-9-&+\/.,\s]+$/).required(),
    //Array aus ObjectIds Not required
    times: Joi.array().items(Joi.object().keys({
      //String darf nur aus Groß- & Kleinbuchstaben, Bindestrichen und Leerzeichen bestehen
      day: Joi.string().valid("Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag").required(),
      //String im Format HH:MM sein Nur 24h Format Nur Zahlen
      starttime: Joi.string().regex(/^[0-9]{2}:[0-9]{2}$/).required(),
      //String im Format HH:MM sein Nur 24h Format Nur Zahlen
      endtime: Joi.string().regex(/^[0-9]{2}:[0-9]{2}/).required(),
    })).required(),
    //String darf nur aus Groß- & Kleinbuchstaben, Bindestrichen und Leerzeichen bestehen
    venue: Joi.string().pattern(/^[a-zA-ZäöüÄÖÜß-\s/.,0-9]+$/).required(),
    //Array aus ObjectIds Required
    department: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  })
};

const updateGroup = {
  params: Joi.object().keys({
    //String als ObjectId
    groupID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  }),
  body: Joi.object().keys({
    //String darf nur aus Groß- & Kleinbuchstaben, Bindestrichen und Leerzeichen bestehen
    name: Joi.string().pattern(/^[a-zA-ZäöüÄÖÜß0-9-&+\/.,\s]+$/),
    //Array aus ObjectIds Not required
    times: Joi.array().items(Joi.object().keys({
      //Darf Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag oder Sonntag sein
      day: Joi.string().valid("Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag").required(),
      //String im Format HH:MM sein Nur 24h Format Nur Zahlen
      starttime: Joi.string().regex(/^[0-9]{2}:[0-9]{2}$/).required(),
      //String im Format HH:MM sein Nur 24h Format Nur Zahlen
      endtime: Joi.string().regex(/^[0-9]{2}:[0-9]{2}$/).required(),
      //WARNING _id wird entfernt
      _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).strip()
    })),
    //String darf nur aus Groß- & Kleinbuchstaben, Bindestrichen und Leerzeichen bestehen
    venue: Joi.string().pattern(/^[a-zA-ZäöüÄÖÜß-\s/.,0-9]+$/),
    //Array aus ObjectIds Required
    department: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    _id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
    //WARNING Nächsten Felder werden entfernt
    participants: Joi.array().items(Joi.object()).strip(),
    trainers: Joi.array().items(Joi.object()).strip(),
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

const updateTrainer = {
  params: Joi.object().keys({
    //String als ObjectId
    groupID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    userID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  }),
  body: Joi.object().keys({
    _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    role: Joi.string().valid('trainer', 'assistant'),
    //WARNING Alle folgenden Felder werden entfernt
    firstname: Joi.string().pattern(/^[a-zA-ZäöüÄÖÜß-\s]+$/).strip(),
    lastname: Joi.string().pattern(/^[a-zA-ZäöüÄÖÜß-\s]+$/).strip(),
  })
};

const addMultipleTrainer = {
  params: Joi.object().keys({
    //String als ObjectId
    groupID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  }),
  body: Joi.array().items(Joi.object().keys({
    //ObjectID als String
    userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),

    role: Joi.string().valid('trainer', 'assistant').required(),

    //WARNING Alle anderen Felder werden entfernt
    firstname: Joi.string().pattern(/^[a-zA-ZäöüÄÖÜß-\s]+$/).strip(),
    lastname: Joi.string().pattern(/^[a-zA-ZäöüÄÖÜß-\s]+$/).strip(),
    email: Joi.string().email().strip(),
    password: Joi.string().strip(),
    accessible_groups: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).strip(),
    roles: Joi.array().strip(),
    headerData: Joi.object().strip(),
  })
    .or('userId', '_id')
  )
};

const createAndAddMember = {
  params: Joi.object().keys({
    //String als ObjectId
    groupID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  }),
  body: Joi.object().keys({
    firstname: Joi.string().pattern(/^[a-zA-ZäöüÄÖÜß-\s]+$/).required(),
    //String darf nur aus Groß- & Kleinbuchstaben, Bindestrichen und Leerzeichen bestehen
    lastname: Joi.string().pattern(/^[a-zA-ZäöüÄÖÜß-\s]+$/).required(),
    //Datum als String im Format YYYY-MM-DD
    birthday: Joi.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/).required(),
    //Datum als String im Format YYYY-MM-DD
    firsttraining: Joi.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/).required(),
    //WARNING Alle folgenden Felder werden entfernt
    openIssues: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).strip(),
    departments: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).strip(),
    groups: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).strip(),

  })
};

const deleteGroup = {
  params: Joi.object().keys({
    //String als ObjectId
    groupID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  })
};

const getData = {
  params: Joi.object().keys({
    groupID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  }),
  query: Joi.object().keys({
    formate: Joi.string().valid('json', 'csv').default('json')
  })
}

module.exports = {
  addMember,
  createGroup,
  getGroupById,
  removeMember,
  updateGroup,
  updateMember,
  removeTrainer,
  addTrainer,
  updateTrainer,
  addMultipleMembers,
  addMultipleTrainer,
  createAndAddMember,
  deleteGroup,
  getData
};
