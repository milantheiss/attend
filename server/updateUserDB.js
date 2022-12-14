const { Group, Attendance } = require("./models");
const mongoose = require("mongoose");
const config = require("./config/config");

async function main() {
  await mongoose.connect(config.url, { dbName: "data" }).then(() => {
    console.log("Connected to MongoDB");
  });
  //Name von Trainer aufsplitten.
  //Trainer in alle Trainingssessions hinzufügen
  //User updaten

  const groups = await Group.find({});

  for (const group of groups) {
    for (const trainer of group.trainer) {
      trainer.firstname = trainer.name.split(" ")[0];
      trainer.lastname = trainer.name.split(" ")[1];
      trainer.position = "trainer";

      delete trainer.name;
    }

    for (const assistent of group.assistent) {
      assistent.firstname = assistent.name.split(" ")[0];
      assistent.lastname = assistent.name.split(" ")[1];
      assistent.position = "assistant";

      delete assistent.name;

      group.trainer.push(assistent);
    }

    await Group.findByIdAndUpdate(group._id, {
      $set: { trainer: group.trainer },
      $unset: { assistent: "" },
    });

    await Attendance.findOneAndUpdate(
      { "group._id": group._id },
      {
        $set: { "trainingssessions.$[].trainers": group.trainer },
      }
    );

    await Attendance.findOneAndUpdate(
      { "group._id": group._id },
      {
        $set: { "trainingssessions.$[].trainers.$[].attended": false }
      }
    );
  }

  console.log("Success");
  return false;
}

main();
