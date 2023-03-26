const { Group, Attendance } = require("./models");
const mongoose = require("mongoose");
const config = require("./config/config");

async function main() {
  mongoose.set('strictQuery', true);

  await mongoose.connect(config.url, { dbName: "data" }).then(() => {
    console.log("Connected to MongoDB");
  });
  //Name von Trainer aufsplitten.
  //Trainer in alle Trainingssessions hinzufügen
  //User updaten

  // const groups = await Group.find({});

  // for (const g of groups) {
  //   const group = await Group.findById(g._id)
  //   for (const trainer of group.trainers) {
  //     console.log(trainer.firstname, trainer._id);
  //     trainer.userId = trainer._doc._id;
  //   }

  //   for (const participant of group.participants) {
  //     participant.memberId = participant._doc._id;
  //   }
  //   await Group.findByIdAndUpdate(group._id, group)
  // }
  // await Group.updateMany({}, {
  //   $unset: {
  //     "trainers.$[].firstname": "", "trainers.$[].lastname": "", "trainers.$[].name": "", "trainers.$[]._id": "",
  //     "participants.$[].firstname": "", "participants.$[].lastname": "", "participants.$[].birthday": "", "participants.$[]._id": ""
  //   }
  // })


  const attendances = await Attendance.find({});

  for (const a of attendances) {
    const attendance = await Attendance.findById(a._id);
    const group = await Group.findById(a.group._id)
    for (const trainingssession of attendance.trainingssessions) {
      const weekday = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];


      const timeInfo = group.times?.find((val) => val.day === weekday[new Date(trainingssession.date).getDay()]);

      trainingssession.starttime = timeInfo?.starttime ?? null;
      trainingssession.endtime = timeInfo?.endtime ?? null;

      if (!trainingssession.starttime || !trainingssession.endtime) {
        console.log(`Keine Zeiten für ${attendance._id} Trainingssession#${attendance.trainingssessions.indexOf(trainingssession)}`);
      }

      for (const participant of trainingssession.participants) {
        participant.memberId = participant._doc._id;
      }

      // for (const trainer of trainingssession.trainers) {
      //   trainer.userId = trainer._doc._id;
      // }

      if (typeof trainingssession.trainers === undefined || trainingssession.trainers === null || trainingssession.trainers.length === 0) {
        console.log(group.trainers);
        trainingssession.trainers = group.trainers.map((val) => { return { userId: val._doc.userId, attended: true } });
      }
    }
    await Attendance.findByIdAndUpdate(attendance._id, attendance);
  }
  await Attendance.updateMany({}, {
    $unset: {
      "trainingssessions.$[].participants.$[].firstname": "", "trainingssessions.$[].participants.$[].lastname": "", "trainingssessions.$[].participants.$[]._id": "",
      "trainingssessions.$[].trainers.$[]._id": ""
    }
  })

  console.log("Done");
}

main();
