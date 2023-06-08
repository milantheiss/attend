const Joi = require('joi');

const updateTrainingssession = {
  params: Joi.object().keys({
    //String als ObjectId
    groupID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    //Datum als String im Format YYYY-MM-DD sein
    date: Joi.string().max(10).truncate().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/).required()
  }),
  body: Joi.object().keys({
    //Array aus ObjectIds Not required
    participants: Joi.array().items(Joi.object().keys({
      //String als ObjectId
      memberId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
      //Boolean ob anwesend
      attended: Joi.boolean().required(),
      //WARNING Wird entfernt
      _id: Joi.string().strip(),
      firstname: Joi.string().strip(),
      lastname: Joi.string().strip(),
      birthdate: Joi.string().strip(),
    })),
    //Array aus ObjectIds Not required
    trainers: Joi.array().items(Joi.object().keys({
      //String als ObjectId
      userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
      //Boolean ob anwesend
      attended: Joi.boolean().required(),
      //WARNING Wird entfernt
      _id: Joi.string().strip(),
      role: Joi.string().strip(),
      firstname: Joi.string().strip(),
      lastname: Joi.string().strip(),
      email: Joi.string().strip(),
      roles: Joi.array().strip(),
    })),
    starttime: Joi.string().regex(/^[0-9]{2}:[0-9]{2}$/).optional(),
    endtime: Joi.string().regex(/^[0-9]{2}:[0-9]{2}$/).optional(),
    date: Joi.string().max(10).truncate().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/).required(),
    _id: Joi.string().strip(),
    totalHours: Joi.number().strip(),
  })
};

const getAttendanceByGroup = {
  params: Joi.object().keys({
    //String als ObjectId
    groupID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  })
};

const getTrainingssession = {
  params: Joi.object().keys({
    //String als ObjectId
    groupID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    //Datum als String im Format YYYY-MM-DD sein
    date: Joi.string().max(10).truncate().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/).required()
  })
};

const getFormattedList = {
  params: Joi.object().keys({
    //String als ObjectId
    groupID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    //Datum als String im Format YYYY-MM-DD sein
    startdate: Joi.string().max(10).truncate().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/).required(),
    //Datum als String im Format YYYY-MM-DD sein
    enddate: Joi.string().max(10).truncate().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/).required()
  })
};


module.exports = {
  updateTrainingssession,
  getAttendanceByGroup,
  getTrainingssession,
  getFormattedList
};