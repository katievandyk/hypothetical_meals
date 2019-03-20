var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const mongoose = require('mongoose');

const Customer = require("../models/Customer")
const Sale = require("../models/Sale")
const mongo_url = require("../configs").mongoURI

mongoose.Promise = global.Promise;

var options = {
    server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 1000000000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 1000000000 } }
};

module.exports.httpGet = httpGet = function(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

module.exports.parseSKUSaleResult = parseSKUSaleResult = function(text, sku_id) {
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

module.exports.onCreateGetSkuSales = onCreateGetSkuSales = async function(sku_num, sku_id) {
    mongoose.connect(mongo_url, options)
    var sales_objs = fetchSalesData(sku_num, sku_id)
    return cacheSalesData(sku_id, sku_num, sales_objs)
}

module.exports.onCreateBulkImportedSkuSales =  onCreateBulkImportedSkuSales = async function(skus_list) {
    mongoose.connect(mongo_url, options)
    var sales_objs = fetchSalesDataBulk(skus_list)
    return cacheSalesDataBulk(sales_objs)
}

function fetchSalesDataBulk(skus_list) {
    var sales_obj = []
    skus_list.forEach(sku => {
        sales_obj.push(fetchSalesData(sku.number, sku._id))
    });

    return [].concat.apply([], sales_obj)
}

function cacheSalesDataBulk(sales_objs) {
    return Promise.all(sales_objs.map(entry => {
        return getSalesStorePromise(entry)
    }))
}


module.exports.fetchSalesData = fetchSalesData = function(sku_num, sku_id) {
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
    return Promise.all(sales_objs.map(entry => {
        return getSalesStorePromise(entry)
    }))
}

module.exports.getSalesStorePromise = getSalesStorePromise = function(entry) {
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


module.exports.sleep = sleep = function(ms) 
{
  var e = new Date().getTime() + (ms);
  while (new Date().getTime() <= e) {}
}

process.on('message', async (message) => {
    if (Array.isArray(message)) 
        onCreateBulkImportedSkuSales(message)
    else if(message.event == "new_sku")
        onCreateGetSkuSales(message.number, message.id)
    else if(message.event == "delete_sku")
        onDeleteRemoveSKUCache(message.id)
  });

module.exports.onDeleteRemoveSKUCache = onDeleteRemoveSKUCache = async function(sku_id) {
    mongoose.connect(mongo_url, options)
    return new Promise(function(accept,reject) {
        Sale.find({sku: sku_id}).then(sales => {
        Promise.all(sales.map(sale => {
            return new Promise(function(accept, reject) {
                Sale.findByIdAndDelete(sale._id).then(accept).catch(reject);
            })
        })).then(result => accept(result)).catch(err => reject(err))
   })})
}
