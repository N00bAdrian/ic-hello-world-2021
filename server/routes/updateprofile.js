var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    if (req.session.username) {
        res.render('updateprofile', {
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

router.get('/', (req, res, next) => {
    res.render('updateprofile', {
        title: 'Update Profile'
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

        if (preferences == null) {
            res.render('updateprofile', {
                title: 'Update Profile',
                message: 'No prefrence selected',
                messageClass: 'alert-danger'
            });
        } else {

            db.get(`SELECT * FROM users WHERE username = ?`, [name], (err, row) => {
                if (err) {
                    return console.error(err.message);
                }

                //console.log(row);

                if (row) {
                    db.run('UPDATE users SET preferences = ? WHERE username = ?', [preferences.toString(), name], (err) => {
                        if (err) {
                            return console.log(err.message);
                        }
                    })
                    
                }
            });
            db.get(`SELECT * FROM users WHERE username = ?`, [name], (err, row) => {
                if (err) {
                  return console.error(err.message);
                }
                if (row) {
                    req.session.preferences = preferences.split(',');
                    res.redirect('/profile'); 
                }
            });
        }
    });
});
module.exports = router;