const cookieParser = require('cookie-parser');
var express = require('express');
var router = express.Router();
// var {app, io} = require('../app');

const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('../database.db', (err) => {
    if (err) {
        console.log(err.message);
    }
});

router.get('/start', (req, res, next) => {
    if (typeof req.session.username == 'undefined') {
        res.render('signin', {
            title: 'Sign in',
            message: 'Log in required',
            messageClass: 'alert-danger'
        });
    }

    res.render('start', {
        title: 'Start'
    });
});

router.post('/start', (req, res) => {
    const {recipe, description, category} = req.body;

    //console.log(recipe+description+category);

    db.run(`INSERT INTO posts(username, recipe, description, category, active) VALUES(?,?,?,?,1)`, [req.session.username, recipe, description, category], (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Inserted with rowid ${this.rid}`);
    });

    db.get(`SELECT MAX(rid) FROM posts`, [], (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        res.redirect(`/cook/session/${row.rid}`);
    });
});

router.get('/session/:rid', (req, res, next) => {
    var rid = parseInt(req.params.rid);
    
    db.get(`SELECT * FROM posts WHERE rid = ? AND active = 1`, [rid], (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        if (row) {
            db.all(`SELECT * FROM comments WHERE postid = ?`, [rid], (err, rows) => {
                res.render('session', {
                    rid: rid,
                    title: 'Session ' + rid,
                    name: row.username,
                    recipe: row.recipe,
                    description: row.description,
                    category: row.category,
                    active: row.active,
                    rows: rows
                });
            });
        } else {
            res.redirect('/cook/message');
        }
    });    
});

router.post('/session/:postid', (req, res) => {
    var postid = parseInt(req.params.postid);
    var {comment} = req.body;
    db.run(`INSERT INTO comments(username, postid, comment) VALUES(?, ?, ?)`, [req.session.username, postid, comment], (err) => {
        if (err) {
            console.error(err.message);
        }
    });
    //res.redirect(`/cook/session/${postid}`);
    io.emit('message', {
        username: req.session.username,
        comment: comment
    });
});

router.get('/end/:rid', (req, res) => {
    var rid = req.params.rid;

    db.run(`UPDATE posts SET active = 0 WHERE rid = ?`, [rid], (err) => {
        if (err) {
            return console.error(err.message);
        }
        res.redirect('/cook/message');
    });
});

router.get('/message', (req, res) => {
    db.all(`SELECT * FROM posts WHERE active=1 AND (username = ? OR category IN (`+ req.session.preferences.map(() => '?').join(',') +`))`, [req.session.username].concat(req.session.preferences), (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        if (rows) {
            res.render('message', {
                title: 'Message',
                rows: rows
            });
        } else {
            db.all(`SELECT * FROM posts WHERE active=1`, [], (err, rows) => {
                if (err) {
                    return console.error(err.message);
                }
                res.render('message', {
                    title: 'Message',
                    rows: rows
                });
            });
        }        
    });
});



module.exports = router;