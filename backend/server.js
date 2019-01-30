
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const path = require ('path');

const API_PORT = 3001;
const PROD_PORT = 8080;


const passport = require("passport");
const users = require("./routes/api/users");

const app = express();

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


// Gives constant name to long directory home page.
const appPage = path.join(__dirname, '../client/build/index.html');

// Allows the use of files.
app.use(express.static('../client/build'));

// SERVES STATIC HOMEPAGE at '/' URL
app.get('*', function(req, res) {
  res.sendFile(appPage)
})

// launch our backend into a port
app.listen(PROD_PORT);
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
