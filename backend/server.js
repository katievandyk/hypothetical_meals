
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");

const API_PORT = 3001;

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

const imports = require('./routes/api/bulk-import');
app.use('/api/bulk-import', imports);

const manufacturing= require('./routes/api/manufacturing');
app.use('/api/manufacturing', manufacturing);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
