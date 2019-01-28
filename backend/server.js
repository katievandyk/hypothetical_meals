
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const API_PORT = 443;

const passport = require("passport");
const users = require("./routes/api/users");

const fs = require('fs')
const https = require('https')

const app = express();

/* Https */
var certOptions = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')
}

// Bodyparser middleware
app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
app.use(bodyParser.json());

const router = express.Router();


const db = require('./configs').mongoURI;
mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Passport User Routes
app.use("/api/users", users);

// // append /api for our http requests
// app.use("/api", router);

// Use Routes
const ingredients = require('./routes/api/ingredients');
app.use('/api/ingredients', ingredients);

const productLines = require('./routes/api/product-lines');
app.use('/api/productlines', productLines);

const skus = require('./routes/api/skus');
app.use('/api/skus', skus);



//Set up HTTPS


var server =  https.createServer(certOptions, app).listen(API_PORT);
// launch our backend into a port
console.log(`LISTENING ON PORT ${API_PORT}`);
