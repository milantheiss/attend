const logger = require("../config/logger");
const { groupService, attendanceService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose")

const getDatasetForInvoice = catchAsync(async (req, res) => {
  let dataset = {
    startdate: req.body.startdate,
    enddate: req.body.enddate,
    groups: []
  };

  let department;

  for (groupID of req.body.groups) {
    const groupInfos = (await groupService.getGroupInfo(req.user, groupID))._doc;
    
    if (typeof department === "undefined") {
      department = groupInfos.department;
    }
    
    if (department._id.equals(groupInfos.department._id)) {
      dataset.groups.push(groupInfos)
      
      let trainingssessions = await attendanceService.getDataForInvoice(
        req.user,
        groupID,
        req.body.startdate,
        req.body.enddate
      );

      dataset.groups.find(val => val._id.equals(new mongoose.Types.ObjectId(groupID))).trainingssessions = []
      
      for (session of trainingssessions) {
        const weekday = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

        //TODO Handle timeInfo undefined
        //Sucht die entsprechende Zeit für den Wochentag heraus.
        const timeInfo = groupInfos.times.find((val) => val.day === weekday[new Date(session.date).getDay()]);

        session._doc.weekday = timeInfo?.day,
        session._doc.starttime = timeInfo?.starttime,
        session._doc.endtime = timeInfo?.endtime,
        session._doc.venue = groupInfos.venue,
        session._doc.groupID = groupID;

        dataset.groups.find(val => val._id.equals(new mongoose.Types.ObjectId(groupID))).trainingssessions.push(session._doc)
      }
    }
  }
  
  dataset.department = department
  
  //Hinzufügen --> Get User Info
  
  dataset.userInfo = {
    email: req.user.email,
    firstname: req.user.firstname,
    lastname: req.user.lastname,
  };

  await res.status(httpStatus.OK).send(dataset);
});

module.exports = {
  getDatasetForInvoice,
};
