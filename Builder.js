var path = require("path");
var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var cors = require("cors")
if (process.env.NODE_ENV === "production") {
    require('dotenv').config({ path: path.resolve(__dirname, `env.production`) })
}
else { require('dotenv').config({ path: path.resolve(__dirname, `env.development`) }) }


//console.log(path.resolve(__dirname, `.env.${process.env.NODE_ENV}`))
var passport = require("passport");
var atlasSession = require("connect-mongodb-session")(session);
var localStrategy = require("passport-local").Strategy;
var dbConnect = require("./dbConnect");
const bcrypt = require('bcryptjs');



var app = express();

//set up cors option
const corsOptions = {
    //To allow requests from client
    origin: '*',
    credentials: true,
    exposedHeaders: ["set-cookie"],
};

//set up session store 
let sessionStore;


const EventEmitter = require('node:events');
const eventEmitter = new EventEmitter();
let altlasError = false;
eventEmitter.on('altlas error', () => {
    console.log('altlas error detected please see logs');
});
sessionStore = new atlasSession(
    {
        uri: process.env.MONGOATLASURI,
        databaseName: process.env.MONGODBENV,
        collection: process.env.MONGOCOLLECTION
    }
)

sessionStore.on('error', function (e) {
    if (e) {
        var responseObject = app.get('resObj');
        console.log("altlas error")
        eventEmitter.emit('altlas error');
        altlasError = true;
    }
    sessionStore = undefined
});


var reqObj;
var resObj;
app.use((req, res, next) => {
    console.log("req")
    reqObj = req;
    resObj = res;
    app.set('reqObj', req)
    app.set('resObj', res)
    next();
})


app.use((req, res, next) => {
    if (altlasError === true)
        res.send("atlas error")
    else next();
})





app.use(cors(corsOptions));
app.use(logger('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: "sfdipji[9"
    , cookie: {
        secure: false,

    }
    ,
    store: sessionStore,


}));

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

        try {

            var result = await dbConnect
                .from(process.env.SUPABASEUSERSTABLE)
                .select('*')
                .eq('username', username);
            //.eq('userpassword', userpassword)
            console.log(result)

            /*    .then((d) => {
   
                   return d;
               })
               .catch((e) => console.error(e)); */

        }
        catch (e) {

        }

        if (!result.data[0])
            return done(null, false, 'message', 'User does not exist.');

        const ismatch = await bcrypt.compare(userpassword, await result.data[0].userpassword)
        if (!ismatch)
            return done(null, false, 'message', 'wrong password');

        return done(null, result.data[0]);
    }
    )

);

passport.serializeUser((user, done) => {
    console.log("This ran")
    //saves to mongodb session
    done(null, user.id)
});

passport.deserializeUser((id, done) => {

    try {
        dbConnect.from(process.env.SUPABASEUSERSTABLE).select('*').eq('id', id)
            .then((d) => {
                done(null, d.data[0])
                console.log(d)
            }).catch(e => {
                if (e) {
                    var responseObject = app.get('resObj');
                    console.log("superbase Error")
                    responseObject.send("superbase Error");
                }

            })
    }
    catch (e) {
        console.log(e)
    }


});


module.exports = app;