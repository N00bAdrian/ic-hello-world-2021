const express = require('express');
const router = express.Router();
const url = require('url');
const crypto = require('crypto');

const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('../database.db', (err) => {
    if (err) {
        console.log(err.message);
    }
});

db.run(`CREATE TABLE IF NOT EXISTS users(
    rid INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
)`);

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

router.get('/', (req, res, next) => {
    res.render('signup', {
        title: 'Sign up'
    });
});

router.post('/', (req, res) => {
    const {name, password, password2} = req.body;

    if (password != password2) {
        res.render('signup', {
            title: 'Sign up',
            message: 'Passwords do not match',
            messageClass: 'alert-danger'
        });
    }

    db.get(`SELECT * FROM users WHERE username = ?`, [name], (err, row) => {
        if (err) {
            return console.error(err.message);
        }

        console.log(row);

        if (row) {
            res.render('signup', {
                title: 'Sign up',
                message: 'User already exists',
                messageClass: 'alert-danger'
            });
        } else {
            console.log(name, password);
            var hash = getHashedPassword(password);
            db.run(`INSERT INTO users(username, password) VALUES(?, ?)`, [name, hash], (err) => {
                if (err) {
                    return console.log(err.message);
                }
            })

            res.render('signin', {
                title: 'Sign in',
                message: 'Success!',
                messageClass: 'alert-success'
            });
        }
    });

});

module.exports = router;