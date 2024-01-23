var app = require('./Builder');
var isaccessible = require('./helpers/isauthenticated')

app.get('/accessible', isaccessible, (req, res, next) => {

    res.json({ authenticated: true })
})
var indexRouter = require("./Routes/index.route");
var signInRouter = require("./Routes/signIn.route");
var signUpRouter = require("./Routes/signup.route");
app.use(indexRouter)
app.use(signInRouter)
app.use(signUpRouter)

console.log("index::this ran")
module.exports = app;


