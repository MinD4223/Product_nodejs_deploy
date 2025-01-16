const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const database = require("./config/database");
const flash = require('express-flash')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
require("dotenv").config();
const systemConfig = require("./config/system");

const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

database.connect();

const app = express();
const port = process.env.PORT;

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
//Flash
app.use(cookieParser('JJDIEHUUFHRU'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// Tiny MCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

app.use(express.static(`${__dirname}/public`));
app.use(methodOverride("_method"));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// App Local Variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;

//Route
route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
