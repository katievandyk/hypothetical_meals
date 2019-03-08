var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const mongoose = require('mongoose');

const Customer = require("../models/Customer")
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

function parseSKUSaleResult(text, sku_id) {
    let table_start = "<table border=1>"
    let table_end = "</table>"
    let index_table_start = text.indexOf(table_start)
    let index_table_end = text.indexOf(table_end)

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
            price_per_case: fields[6],
            sku_id: sku_id
        }
        return obj;
    })
    return table
}

async function onCreateGetSkuSales(sku_num, sku_id) {
    mongoose.connect(mongo_url, options, function (err) {
        if (err) throw err;
        var sales_objs = fetchSalesData(sku_num, sku_id)
        cacheSalesData(sku_id, sku_num, sales_objs)
    })
}

async function onCreateBulkImportedSkuSales(skus_list) {
    mongoose.connect(mongo_url, options, function (err) {
        if (err) throw err;
        var sales_objs = fetchSalesDataBulk(skus_list)
        cacheSalesDataBulk(sales_objs)
    })
}

function fetchSalesDataBulk(skus_list) {
    var sales_obj = skus_list.map(sku => {
        return fetchSalesData(sku['sku#'], sku._id)
    })

    return [].concat.apply([], sales_obj)
}

function cacheSalesDataBulk(sales_objs) {
    Promise.all(sales_objs.map(entry => {
        return getSalesStorePromise(entry)
    })).then(results => {
        console.log(`Successfully cached bulk imported SKUs. Number of records: ` + results.length)
    }).catch(err => {
        console.log("Errors storing: " + err)
    })
}


function fetchSalesData(sku_num, sku_id) {
    var sales_objs = []

    for (year = 1999; year <= 2019; year++) {
        url = `http://hypomeals-sales.colab.duke.edu:8080/?sku=${sku_num}&year=${year}`
        var sales_data = httpGet(url)
        Array.prototype.push.apply(sales_objs,parseSKUSaleResult(sales_data, sku_id)); 
        sleep(200)
    }

    return sales_objs
}

function cacheSalesData(sku_id, sku_num, sales_objs) {
    Promise.all(sales_objs.map(entry => {
        return getSalesStorePromise(entry)
    })).then(results => {
        console.log(`Successfully cached sales for SKU ${sku_num}. Number of records: ` + results.length)
    }).catch(err => {
        console.log("Errors storing: " + err)
    })
}

function getSalesStorePromise(entry) {
    return new Promise(function( accept, reject) {
        Customer.findOne({number: parseInt(entry.cust_number)})
        .then(cust => {
            var newSale = new Sale({
                sku: entry.sku_id,
                customer: cust._id,
                year: entry.year,
                week: entry.week,
                sales: entry.sales,
                price_per_case: entry.price_per_case
            })
            newSale.save().then(accept).catch(reject)
        }).catch(reject)
    })
}


function sleep(ms) 
{
  var e = new Date().getTime() + (ms);
  while (new Date().getTime() <= e) {}
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

process.on('message', async (message) => {
    if (Array.isArray(message)) 
        onCreateBulkImportedSkuSales(message)
    else
        onCreateGetSkuSales(message.number, message.id)
  });

// Uncomment the following line to get and store customers in DB.
// getCustomers()