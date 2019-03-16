const mongoose = require('mongoose');

const Customer = require("../models/Customer")
const Track = require("./track")
var mongo_url = require('../configs').mongoURI

mongoose.Promise = global.Promise;

var options = {
    server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 1000000000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 1000000000 } }
  };

function getCustomers() {
    mongoose.connect(mongo_url, options, function (err) {
        if (err) throw err;

        url = "http://hypomeals-sales.colab.duke.edu:8080/customers"
        var customer_data = Track.httpGet(url)
        var customer_data = parseCustomersData(customer_data)

        
        Customer.insertMany(customer_data).then(result => {
            mongoose.connection.close()
            console.log("Inserted all customers")
        }).catch(err => {
            mongoose.connection.close()
            console.log(err.message)
        })
    })
}

 function parseCustomersData(text) {
    var table = text.split("\n").splice(1).filter(line => line.length != 0)
    table = table.map(line => {
        var l = line.substring(8)
        var fields = l.split("<td>")
        var obj = {
            _id: new mongoose.Types.ObjectId(),
            number: fields[0],
            name: fields[1]
        }
        return obj;
    })
    return table
}

getCustomers()