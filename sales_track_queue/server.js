
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const API_PORT = 3002;

const app = express();

// Bodyparser middleware
app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
app.use(bodyParser.json());


const db = require('../backend/configs').mongoURI;
mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected- Sales Tracking'))
    .catch(err => console.log(err));


const queue = require('./routes/api/send-message');
app.use('/api/queue', queue);

var env = process.env.NODE_ENV || 'dev';

// if(env!=='dev') {
//   // Gives constant name to long directory home page.
//   const appPage = path.join(__dirname, '../client/build/index.html');

//   // Allows the use of files.
//   app.use(express.static('../client/build'));

//   // SERVES STATIC HOMEPAGE at '/' URL
//   app.get('*', function(req, res) {
//     res.sendFile(appPage)
//   })
// }

const kue = require('kue')
var jobs = kue.createQueue();
const Track = require('../backend/sales_tracking/track')

jobs.process('new_sku', function (job, done){
    Track.onCreateGetSkuSales(job.data.number, job.data.id)
    .then(results => {
        console.log(`Successfully cached sales for SKU ${job.data.number}. Number of records: ` + results.length)
        done && done();
    }).catch(err => {
        console.log("Errors storing: " + err)
        done && done();
    })
});

jobs.process('delete_sku', function (job, done) {
    Track.onDeleteRemoveSKUCache(job.data.id)
    .then(result => {
      console.log("Removed SKU sales from cache. Number of records: " + result.length)
      done && done();
    })
    .catch(err => {
      console.log(err.message)
      done && done();
    })
    
});

jobs.process('bulk_skus', function (job, done){
    Track.onCreateBulkImportedSkuSales(job.data.skus)
    .then(results => {
      console.log(`Successfully cached bulk imported SKUs. Number of records: ` + results.length)
      done && done();
  }).catch(err => {
      console.log("Errors storing: " + err)
      done && done();
  })
});



// launch our backend into a port
app.listen(API_PORT, () => console.log(`SALES LISTENING ON PORT ${API_PORT}`));
