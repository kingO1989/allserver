var express = require("express");
var router = express.Router();
router.get('/', (req, res, next) => {
    res.send("Home")
});


router.get('/profile', (req, res, next) => {

    res.json({ login: "success" })
})



module.exports = router;