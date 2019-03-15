const mongoose = require('mongoose');
const Track = require('./track')
const Customer = require("../models/Customer")
const Sale = require("../models/Sale")
const SKU = require("../models/SKU")
var MongoClient = require('mongodb').MongoClient;
var mongo_url = require('../configs').mongoURI
var mong_db = mongo_url.substring(mongo_url.lastIndexOf("/")+1)

var options = {
    server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 1000000000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 1000000000 } }
  };

function fetchSalesData(sku) {
    url = `http://hypomeals-sales.colab.duke.edu:8080/?sku=${sku.number}&year=2019`
    var sales_data = Track.httpGet(url)
    var sales_objs = Track.parseSKUSaleResult(sales_data, sku._id)
    Track.sleep(200)

    return sales_objs
}

function fetchSalesDataBulk(skus_list) {
    skus_list.forEach(sku => {
        sku.sales_data = fetchSalesData(sku)
    });
    return skus_list
}

function dailyCacheUpdate() {
    mongoose.connect(mongo_url, options, function (err) {
        if (err) throw err;
        
        SKU.find().select("number _id").lean().then(skus => {
            var skus_with_sales = fetchSalesDataBulk(skus)
            Promise.all(skus_with_sales.map(sku => {
                return new Promise(function(accept,reject) {
                    Sale.find({sku: sku._id}).sort({year: -1, week: -1}).limit(1)
                    .then(max_year => {
                        if(max_year.length > 0) {
                            sku.sales_data = sku.sales_data.filter(sale => (parseInt(sale.year) >= max_year[0].year && parseInt(sale.week) > max_year[0].week))
                            accept(sku.sales_data)
                        }
                        else {
                            accept(Track.fetchSalesData(sku.number, sku._id))
                        }
                    })
                })
            })).then(results => {
                var flattened = [].concat.apply([], results)
                Promise.all(flattened.map(entry => {
                    return Track.getSalesStorePromise(entry)
                })).then(results => {
                    console.log(`Daily cache update: Successfully cached SKUs. Number of records: ` + results.length)
                    mongoose.connection.close()
                }).catch(err => {
                    console.log("Daily cache update: Errors storing: " + err)
                    mongoose.connection.close()
                })
            }).catch(err => {
                mongoose.connection.close()
                console.log(err)
            })
        })
    })
}

console.log("Daily update for " + new Date().toLocaleString())
dailyCacheUpdate()