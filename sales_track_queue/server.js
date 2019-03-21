
var os = require('os');
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

if (process.env && process.env.pm_id) {
  //running in pm2 
  if (process.env.pm_id % os.cpus().length !== 0) {
      console.log("Not master process.")
      return;
  } else {
    // Only master process should process jobs
    console.log("Master process: processing jobs.")
    processJobs();
 }
}
else {
  // DEV
  processJobs();
}

function processJobs() {
  jobs.process('cache_job', function (job, done){
    if (job.data.job_name == "delete_sku") {
      console.log("Starting delete_sku job.")
      Track.onDeleteRemoveSKUCache(job.data.id)
      .then(result => {
        console.log("Removed SKU sales from cache. Number of records: " + result.length)
        done && done();
      })
      .catch(err => {
        console.log(err.message)
        done && done();
      })
    }
    else if(job.data.job_name == "new_sku") {
      console.log("Starting new_sku job.")
      Track.onCreateGetSkuSales(job.data.number, job.data.id)
      .then(results => {
          console.log(`Successfully cached sales for SKU ${job.data.number}. Number of records: ` + results.length)
          done && done();
      }).catch(err => {
          console.log("Errors storing: " + err)
          done && done();
      })
    }
    else if(job.data.job_name == "bulk_skus") {
      console.log("Starting bulk_skus job.")
      Track.onCreateBulkImportedSkuSales(job.data.skus)
      .then(results => {
        console.log(`Successfully cached bulk imported SKUs. Number of records: ` + results.length)
        done && done();
      }).catch(err => {
          console.log("Errors storing: " + err)
          done && done();
      })
    }
  });
}

// launch our backend into a port
app.listen(API_PORT, () => console.log(`SALES LISTENING ON PORT ${API_PORT}`));
