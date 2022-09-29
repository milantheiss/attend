const bcrypt = require("bcrypt");

const prompt = require("prompt-sync")({ sigint: true });

const password = prompt("Gebe das Passwort ein: ")

bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      throw err;
    }
    console.log('Das gehashte Passwort ist: ', hash);
})