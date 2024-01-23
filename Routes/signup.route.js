var express = require("express");
const bcrypt = require('bcryptjs')
var dbConnect = require("../dbConnect");
var router = express.Router();
router.post('/signup', async (req, res, next) => {

    console.log(process.env.MONGODB)
    console.log(process.env.SUPABASEUSERSTABLE)
    const { username, userpassword } = req.body;
    var salt = await bcrypt.genSalt(10);
    const hashpwd = await bcrypt.hash(userpassword, salt);
    console.log(salt);
    console.log(hashpwd);
    dbConnect
        .from(process.env.SUPABASEUSERSTABLE)
        .insert({
            username: username,
            userpassword: hashpwd
        }).then(() => {
            res.status(201)
            res.send("Registration successfull"
            )
        }
        )
        .catch(e => res.send("failed registration")
        );
}
);

module.exports = router;