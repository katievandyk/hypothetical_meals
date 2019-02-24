var MongoClient = require('mongodb').MongoClient;
const ManufacturingSchedule = require('../models/ManufacturingSchedule');
const mongoose = require('mongoose');

var url = require('../configs').mongoURI;
var dbName = require('../configs').dbName;

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db(dbName);
  var schedule = new ManufacturingSchedule({
        _id : new mongoose.Types.ObjectId(),
        name: 'schedule'
  });
  dbo.collection("manufacturingschedules").insertOne(schedule, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
  
});