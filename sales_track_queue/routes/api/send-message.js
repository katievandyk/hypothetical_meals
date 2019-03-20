const express = require("express");
const router = express.Router();
// const Track = require("../../sales_tracking/track")
const kue = require('kue')
var jobs = kue.createQueue();


router.post('/', (req, res) => {
    console.log("hereeeee")
    // if(req.body.type == "new_sku")
    res.json({success: true})

    var job = jobs.create('delete_sku', req.body);
    job.on('complete', function (){
        console.log('Job', job.id, 'with type', job.data.type, 'is    done');
    }).on('failed', function (){
        console.log('Job', job.id, 'with type', job.data.type, 'has  failed');
    });
    job.save();
});

module.exports = router;