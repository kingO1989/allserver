var express = require("express");
var passport = require("passport");
var router = express.Router();

router.post('/signin', passport.authenticate(
    'local', {
    successRedirect: '/profile',
    failureRedirect: '/loginerror'
}
))

router.get('/signin', (req, res) => {

    res.send("Please sign in")
}
);

router.get('/signout', (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
}
)

router.get('/signin_error', (req, res, next) => {

    res.json({ login: "failure" })
})


module.exports = router;