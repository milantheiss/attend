const logger = require("../config/logger");
const { groupService, attendanceService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const getDatasetForInvoice = catchAsync(async (req, res) => {
  let dataset = {
    startdate: req.body.startdate,
    enddate: req.body.enddate,
    trainingssessions: [],
  };

  for (groupID of req.body.groups) {
    const groupInfos = (await groupService.getGroupInfo(req.user, groupID))._doc;
    delete groupInfos.trainer;

    let trainingssessions = await attendanceService.getDataForInvoice(
      req.user,
      groupID,
      req.body.startdate,
      req.body.enddate
    );

    for (session of trainingssessions) {
      const weekday = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
      const timeInfo = groupInfos.times.find(val => val.day === weekday[new Date(session.date).getDay()])
      
      //TODO Handeling von fehlenden Zeiten hinzufügen

      session._doc.info = {
        groupName: groupInfos.name,
        departmentName: groupInfos.department.name,
        weekday: timeInfo?.day,
        starttime: timeInfo?.starttime,
        endtime: timeInfo?.endtime,
        venue: groupInfos.venue
      }
      session._doc.groupID = groupID;
    }

    dataset.trainingssessions = dataset.trainingssessions.concat(trainingssessions);
  }

  //Hinzufügen --> Get User Info

  dataset.userInfo = {
    email: req.user.email,
    firstname: req.user.firstname,
    lastname: req.user.lastname
  };

  res.status(httpStatus.OK).send(dataset);
});

module.exports = {
  getDatasetForInvoice,
};
