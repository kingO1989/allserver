const app = require('./index');
app.listen('3000', () => {
    console.log("Listening on 3000");
    console.log(process.env.NODE_ENV)
    console.log(app.settings.env)

}
) 
