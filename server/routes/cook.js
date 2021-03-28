var express = require('express');
var router = express.Router();

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

    console.log(recipe+description+category);

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
        res.redirect(`/cook/session?rid=${row.rid}`);
    });
});

router.get('/session', (req, res, next) => {
    var rid = req.
})



module.exports = router;