var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    if (req.session.username) {
        res.render('changepassword', {
            title: req.session.username,
            name: req.session.username,
            preferences: req.session.preferences
        });
    } else {
        res.redirect('/signin');
    }
});

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
    password TEXT NOT NULL,
    preferences TEXT NOT NULL
)`);

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

router.get('/', (req, res, next) => {
    res.render('changepassword', {
        title: 'Change Password'
    });
});

router.post('/', (req, res) => {
    const { oldpassword, password, password2, preferences } = req.body;
    //console.log(preferences.toString());
    var name = req.session.username;
    db.get(`SELECT * FROM users WHERE username = ?`, [name], (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        //console.log(row);
        var hash = getHashedPassword(oldpassword);
        if (row) {
            if (row.password != hash) {
                res.render('changepassword', {
                    title: 'Change Password',
                    message: 'Wrong old password',
                    messageClass: 'alert-danger'
                });
            } else {
                hash = getHashedPassword(password);
                if (password != password2) {
                    res.render('changepassword', {
                        title: 'Change Password',
                        message: 'New passwords do not match',
                        messageClass: 'alert-danger'
                    });
                } else {
                    db.get(`SELECT * FROM users WHERE username = ?`, [name], (err, row) => {
                        if (err) {
                            return console.error(err.message);
                        }
                        //console.log(row);
                        if (row) {
                            //console.log(name, password);
                            var hash = getHashedPassword(password);
                            db.run('UPDATE users SET password = ? WHERE username = ?', [hash, name], (err) => {
                                if (err) {
                                    return console.log(err.message);
                                }
                            })
                            res.render('changepassword', {
                                title: 'Change Password',
                                message: 'Success!',
                                messageClass: 'alert-success'
                            });
                        }
                    });
                }
            }
        }
    });
});
module.exports = router;