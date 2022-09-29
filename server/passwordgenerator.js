const bcrypt = require("bcrypt")

bcrypt.hash("4oxZBsMcxbBjLQ", 10, (err, hash) => {
    if (err) {
      throw err;
    }
    console.log('Your hash: ', hash);
})