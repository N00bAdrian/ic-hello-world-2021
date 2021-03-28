
var express = require('express');
var router = express.Router();
const crypto = require('crypto');

const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('../database.db', (err) => {
    if (err) {
        console.log(err.message);
    }
});

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('signin', { title: 'Sign in' });
});

router.post('/', (req, res) => {
  const {name, password} = req.body;
  console.log(name);

  db.get(`SELECT * FROM users WHERE username = ?`, [name], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    console.log(row);
    if (row) {
      var hash = getHashedPassword(password);
      if (row.password == hash) {
        var sess = req.session;
        sess.username = name;
        sess.preferences = row.preferences.split(',');
        res.redirect('/profile'); 
      } else {
        res.render('signin', {
          title: 'Sign in',
          message: 'Wrong password',
          messageClass: 'alert-danger'
        });
      }
    } else {
      res.render('signin', {
        title: 'Sign in',
        message: 'User does not exist',
        messageClass: 'alert-danger'
      });
    }

  });
});

module.exports = router;