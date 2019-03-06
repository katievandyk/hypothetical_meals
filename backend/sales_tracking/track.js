var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Customer = require("../models/Customer")
const SKU = require("../models/SKU")
const Sale = require("../models/Sale")
var MongoClient = require('mongodb').MongoClient;
var mongo_url = require('../configs').mongoURI
var mong_db = mongo_url.substring(mongo_url.lastIndexOf("/")+1)

mongoose.Promise = global.Promise;

var options = {
    server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 1000000000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 1000000000 } }
  };


function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

getSKUSales(1001, 2019)

function parseSKUSaleResult(text) {
    let table_start = "<table border=1>"
    let table_end = "</table>"
    let index_table_start = text.indexOf(table_start)
    let index_table_end = text.indexOf(table_end)
    console.log(index_table_start + " " + index_table_end)

    var table = text.substring(index_table_start, index_table_end)
    table = table.split("\n").splice(1).filter(line => line.length != 0)
    table = table.map(line => {
        var l = line.substring(8)
        var fields = l.split("<td>")
        var obj = {
            year: fields[0],
            sku_number: fields[1],
            week: fields[2],
            cust_number: fields[3],
            cust_name: fields[4],
            sales: fields[5],
            price_per_case: fields[6]
        }
        return obj;
    })
    return table
}

function getSKUSales(num, year) {
    url = `http://hypomeals-sales.colab.duke.edu:8080/?sku=${num}&year=${year}`
    var sales_data = httpGet(url)
    var sales_objs = parseSKUSaleResult(sales_data)

    mongoose.connect(mongo_url, options, function (err) {
        if (err) throw err;
        
        console.log('Successfully connected');
        
        SKU.find({number: parseInt(num)}).then(sku => {
            console.log(sku)
            Promise.all(sales_objs.map(entry => {
                return new Promise(function( accept, reject) {
                    Customer.findOne({number: parseInt(entry.cust_number)})
                    .then(cust => {
                        var newSale = new Sale({
                            sku: sku._id,
                            customer: cust._id,
                            year: entry.year,
                            week: entry.week,
                            sales: entry.sales,
                            price_per_case: entry.price_per_case
                        })
                        newSale.save().then(accept).catch(reject)
                    }).catch(reject)
                })
            })).then(results => {
                console.log(results)
                mongoose.connection.close()
            }).catch(err => {
                console.log("Errors storing")
                mongoose.connection.close()
            })
        })
    })
}
                                        
function getCustomers() {
    url = "http://hypomeals-sales.colab.duke.edu:8080/customers"
    var customer_data = httpGet(url)
    customer_data = parseCustomersData(customer_data)

    MongoClient.connect(mongo_url, function(err, db) {
        var dbo = db.db(mong_db)
        Promise.all(customer_data.map(entry => {
            new Promise(function( accept, reject) {
                var newCustomer = new Customer(entry)
                dbo.collection("customers").insertOne(newCustomer).then(accept).catch(reject)
            })
        })).then(result => {
            db.close()
            console.log("Inserted all customers")
        }).catch(err => {
            db.close()
        })
    })
    
}

function parseCustomersData(text) {
    var table = text.split("\n").splice(1).filter(line => line.length != 0)
    table = table.map(line => {
        var l = line.substring(8)
        var fields = l.split("<td>")
        var obj = {
            number: fields[0],
            name: fields[1]
        }
        return obj;
    })
    return table
}

// getCustomers()

// httpGet("http://hypomeals-sales.colab.duke.edu:8080/?sku=34&year=2019", printResult)

module.exports = router;