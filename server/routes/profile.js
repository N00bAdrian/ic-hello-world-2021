var express = require('express');
var router = express.Router();

const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../database.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
});

router.get('/', (req, res, next) => {
    if (req.session.username) {
        db.all(`SELECT * FROM posts WHERE username = ? ORDER BY rid DESC`, [req.session.username], (err, rows) => {
            res.render('profile', {
                title: req.session.username,
                name: req.session.username,
                preferences: req.session.preferences,
                rows: rows
            });            
        });
    } else {
        res.redirect('/signin');
    }
});

module.exports = router;