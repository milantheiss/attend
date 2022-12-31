const logger = require('./config/logger');
const mongoose = require('mongoose');
const config = require('./config/config');
const authService = require("./services").authenticationService
const prompt = require('prompt-sync')({ sigint: true })
const bcrypt = require("bcrypt")

async function main() {
    await mongoose.connect(config.url, { dbName: 'data' }).then(() => {
        logger.info('Connected to MongoDB');
    })

    do {
        console.log("**************************************\nUser Controller for Admins\n[1] New User\n[2] Update User\n[3] Delete User\n[4] Quit")

        let input = prompt()

        console.log("**************************************")

        if (input === '4') {
            break
        }

        let userId
        if (input !== '1' && input !== '3') {
            const userId = prompt('User ID: ')
        }

        let user = {}
        //Delete User
        if (input === '3') {
            user = await authService.getUserById(userId)
            if (prompt("Möchten Sie wirklich den User '" + user.username + "' löschen? (Y/N) ").toUpperCase() !== 'Y') {
                continue
            } else {
                console.log("User wird gelöscht")
                await authService.deleteUser(userId)
                continue
            }
        }

        let body = {}

        body.firstname = prompt(`Vorname (${user.firstname}): `, user.firstname)
        body.lastname = prompt(`Nachname (${user.lastname}): `, user.lastname)
        body.username = prompt(`Username (${user.username}): `, user.username)
        body.password = prompt(`Password (********): `, user.password, { echo: '*' })

        do {
            if (body.password.length > 0) {
                body.password = await bcrypt.hash(body.password, 10)
                break
            } else {
                body.password = prompt(`Passwort (Min 1 Zeichen): `, user.password, { echo: '*' })
            }
        } while (true)
        
        body.email = prompt(`E-Mail (${user.email}): `, user.email)

        do {
            const _role = prompt(`Rollen (${user.role}): `)
            if (typeof _role !== 'undefined' && _role.length > 0) {
                body.roles.push(new mongoose.Types.ObjectId(_role))
                if (prompt("Möchten Sie noch eine Rolle dem User zu weisen? (Y/N) ").toUpperCase() !== 'Y') {
                    break
                }
            } else {
                break
            }
        } while (true)

        body.refresh_tokens = []
        body.accessible_groups = []

        do {
            const _groupID = prompt('Accessible Group ID: ')
            if (typeof _groupID !== 'undefined' && _groupID.length > 0) {
                body.accessible_groups.push(new mongoose.Types.ObjectId(_groupID))
                if (prompt("Möchten Sie noch eine Gruppe dem User zu weisen? (Y/N) ").toUpperCase() !== 'Y') {
                    break
                }
            } else {
                break
            }
        } while (true)

        if (input === '1') {
            //Neuer User
            await authService.createUser(body)
        } else if (input === '2') {
            await authService.updateUser(userId, body)
        } 
    } while (true);
    mongoose.connection.close()
}

main()