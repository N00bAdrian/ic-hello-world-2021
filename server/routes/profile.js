var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    if (req.session.username) {
        res.render('profile', {
            title: req.session.username,
            name: req.session.username
        });
    } else {
        res.redirect('/signin');
    }
});

module.exports = router;