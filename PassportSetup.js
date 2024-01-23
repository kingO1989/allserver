var path = require("path");
var passport = require("passport");
var localStrategy = require("passport-local").Strategy;
var dbConnect = require("./dbConnect");
const bcrypt = require('bcryptjs');

if (process.env.NODE_ENV === "production") {
    require('dotenv').config({ path: path.resolve(__dirname, `env.production`) })
}
else { require('dotenv').config({ path: path.resolve(__dirname, `env.development`) }) }
function passportSetup(app) {
    console.log("passport")
    app.use(passport.initialize());
    app.use(passport.session());


    passport.use('local',
        new localStrategy({
            usernameField: "username",
            passwordField: "userpassword",
            passReqToCallback: true
        }, async (req, username, userpassword, done) => {

            if (!username || !userpassword)
                return done(null, false, 'message', 'All fields are required');
            var data = await dbConnect
                .from(process.env.SUPABASEUSERSTABLE)
                .select('*')
                .eq('username', username)
                //.eq('userpassword', userpassword)
                .then((d) => {

                    return d;
                })
                .catch((e) => console.error(e));



            if (!data.data[0])
                return done(null, false, 'message', 'User does not exist.');

            const ismatch = await bcrypt.compare(userpassword, data.data[0].userpassword)
            if (!ismatch)
                return done(null, false, 'message', 'wrong password');

            return done(null, data.data[0]);
        }
        )

    );

    passport.serializeUser((user, done) => {
        console.log("This ran")
        //saves to mongodb session
        done(null, user.id)
    });

    passport.deserializeUser((id, done) => {
        dbConnect.from(process.env.SUPABASEUSERSTABLE).select('*').eq('id', id)
            .then((d) => {
                done(null, d.data[0])
                console.log(d)
            }).catch(e => console.error(e))
    });

    return app

}

module.exports = passportSetup;