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
        db.get(`SELECT * FROM posts WHERE username = ? ORDER BY rid DESC`, [req.session.username], (err, row) => {
            res.render('profile', {
                title: row.username,
                name: row.username,
                preferences: row.preferences,
                row: row
            });            
        });
    } else {
        res.redirect('/signin');
    }
});

module.exports = router;