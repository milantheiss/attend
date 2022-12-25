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
      
      for (session of trainingssessions) {
        const weekday = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

        //TODO Handle timeInfo undefined
        //Sucht die entsprechende Zeit für den Wochentag heraus.
        const timeInfo = groupInfos.times.find((val) => val.day === weekday[new Date(session.date).getDay()]);

        if (typeof timeInfo?.starttime !== "undefined" && typeof timeInfo?.endtime !== "undefined") {
          //Formatiert Zeit vom Format 18:45 in 18,75
          const startingTime =
            Number(timeInfo?.starttime.split(":")[0]) + Number(timeInfo?.starttime.split(":")[1] / 60);

          const endingTime = Number(timeInfo?.endtime.split(":")[0]) + Number(timeInfo?.endtime.split(":")[1] / 60);

          //Berechnet Länge des Trainings. Bsp: Für 1 Std 30 min --> 1,5
          timeInfo.length = endingTime - startingTime;
        }

        session._doc.info = {
          groupName: groupInfos.name,
          departmentName: groupInfos.department.name,
          weekday: timeInfo?.day,
          starttime: timeInfo?.starttime,
          endtime: timeInfo?.endtime,
          length: timeInfo?.length,
          venue: groupInfos.venue,
        };
        session._doc.groupID = groupID;

        dataset.trainingssessions.push(session._doc)
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

  dataset.totalHours = 0

  dataset.trainingssessions.forEach(val => dataset.totalHours += val.info.length)

  await res.status(httpStatus.OK).send(dataset);
});

module.exports = {
  getDatasetForInvoice,
};
