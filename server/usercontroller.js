const logger = require('./config/logger');
const mongoose = require('mongoose');
const config = require('./config/config');
const authService = require("./services").authenticationService
const prompt = require('prompt-sync')()

async function main() {
    await mongoose.connect(config.url, { dbName: 'data' })

    logger.info('Connected to MongoDB');



    do {
        console.log("**************************************\nUser Controller for Admins\n[1] New User\n[2] Update User\n[3] Delete User\n[4] Quit")

        let input = prompt()

        console.log("**************************************")

        if (input === '4') {
            break
        }

        if (input !== '1' && input !== '2' && input !== '3') {
            continue
        }

        const userId = prompt('User ID: ')

        if (input === '1' || input === '2') {

            const test = prompt('Test ')

            console.log(test.length)

            //Neuer User oder Update User
        } else if (input === '3') {
            //Delete User
            const user = await authService.getUserById(userId)
            do {
                input = prompt("Möchten Sie wirklich den User '" + user.username + "' löschen? (Y/N) ")
            } while (input.toUpperCase() !== 'Y' && input.toUpperCase() !== 'N')

            if (input.toUpperCase() === 'Y') {
                console.log("User wird gelöscht")
                await authService.deleteRefreshToken(userId)
            }
        }
    } while (true);
    mongoose.connection.close()
}

main()