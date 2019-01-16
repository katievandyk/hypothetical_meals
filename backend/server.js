
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");

const API_PORT = 3001;
const app = express();
const router = express.Router();

app.use(bodyParser.json());

const db = require('./configs').mongoURI;
mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// // append /api for our http requests
// app.use("/api", router);

// Use Routes
const ingredients = require('./routes/api/ingredients');
app.use('/api/ingredients', ingredients);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));