
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const API_PORT = 3001;

const passport = require("passport");
const users = require("./routes/api/users");

const fs = require('fs')
const https = require('https')

const app = express();

/* Https */
try {
  var certOptions = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
  }
}
catch(err) {
  var certOptions = {
    key: null,
    cert: null
  }
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

const manufacturing= require('./routes/api/manufacturing');
app.use('/api/manufacturing', manufacturing);

if(true) {
  console.log("in prod");
  app.use(express.static(path.resolve(__dirname,'/../client/build')));
  app.get('*', (req, res) => {
    res.sendfile(path.resolve(__dirname,'../client/build/index.html'));
    res.end();
  })
  app.listen(3000, () => console.log(`LISTENING ON PORT ${API_PORT}`));

}
else {
  app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));

}

//Set up HTTPS
// try {
//   var server =  https.createServer(certOptions, app).listen(443);
// }
// catch(err) {
//   var server = http.createServer(app).listen(API_PORT);
// }
/* Http */
//app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));

