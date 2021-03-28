var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('../database.db', (err) {
  if (err) throw err;
});

/* GET home page. */
router.get('/', function(req, res, next) {
  db.all(`SELECT username, preferences FROM users`, [], (err, rows) => {
    if (err) throw err;
    res.render('connect', { 
      title: 'Connect',
      rows: rows
    });
  });
});


module.exports = router;