const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('connected to database');
});

module.exports = db;