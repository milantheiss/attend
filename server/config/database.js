const mongoose = require("mongoose");

const { MONGO_URI } = process.env;

/**
 * Verbindet sich zu MongoDB Datenbank mit gegebenen Namen 
 * @param {String} dbName Namen der Datenbank
 * @returns Connection
 */
function connect(dbName) {
    // Connecting to the database
    const conn = mongoose.createConnection(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: dbName
    })

    conn.on('error', (err) => {
        console.log("database connection failed. exiting now...");
        console.error(error);
        process.exit(1);
    })

    conn.once('connected', () => {
        console.log(`Successfully connected to database ${dbName}`)
    })

    return conn
}

const authDB = mongoose.createConnection(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'auth'
})


module.exports = {

}