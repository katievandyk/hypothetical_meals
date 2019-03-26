const express = require('express');
const moment = require('moment');
const router = express.Router();
const Helper = require('../../bulk_import/helpers');
const SKU = require('../../models/SKU')
const Sale = require('../../models/Sale')
const ManufacturingActivity = require('../../models/ManufacturingActivity')
const Goal = require('../../models/Goal')
const Customer = require('../../models/Customer')

function groupByYear(res) {
    return res.reduce(function(r,a) {
        r[a.year] = r[a.year] || [];
        r[a.year].push(a);
        return r;
    }, Object.create(null))
}

function groupByPL(res) {
    return res.reduce(function(r,a) {
        r[a.pl] = r[a.pl] || [];
        r[a.pl].push(a);
        return r;
    }, Object.create(null))
}

function round(num) {
    return Math.round(num * 100) / 100
}

// @route POST api/sales/customers
// request body fields:
// - keywords
router.post('/customers', (req, res) => {
    var customerFindPromise;
    if (req.body.keywords != null)
        customerFindPromise = Customer.find(
            {$text: {$search: req.body.keywords,
                $caseSensitive: false,
                $diacriticSensitive: true}},
            {score:{$meta: "textScore"}});
    else
        customerFindPromise = Customer.find()

    customerFindPromise.then(customers => res.json(customers)).catch(err => res.status(404).json({success: false, message: err.message}))
})

// @route POST api/sales/summary
// request body fields:
// - skus: list of sku ids to get sales summary for
// - customer: customer to calculate sales for
// - export: if true will return csv result
// returns:
// - [{sku: sku_id, entries: list of objects- each representing aggregated calculations for one year, summary: [one entry per year for 10 years]}]
router.post('/summary', (req, res) => {
    var year = new Date().getFullYear()
    var yearMinus9 = year-9
    var startDate = moment(`01-01-${yearMinus9}`, 'MM-DD-YYYY')
    var endDate = moment(`01-01-${year+1}`, 'MM-DD-YYYY')
    Promise.all(req.body.skus.map(sku_id => {
        return calculateAggregatedForOneSKU(sku_id, startDate, endDate, req.body.customer)
    })).then(results => {
        if(req.body.export) {
            results = generateCsvSummary(results)
            res.setHeader('Content-Type', 'text/csv')
            res.status(200).send(results)
        }
        else {
            res.json(results)
        }
    })
})

function generateCsvSummary(results) {
    results = groupByPL(results)
    var lines = []
    var keys = Object.keys(results)
    keys.forEach(pl => {
        lines.push("Product line")
        lines.push(pl)
        lines.push("Name,Unit size,Count per case,Year,Revenue,Sales,Average")
        results[pl].forEach(sku_entry => {
            sku_entry.entries.forEach(entry => {
                lines.push(`${sku_entry.name},${sku_entry.unit_size},${sku_entry.count_per_case},${entry.year},${round(entry.revenue)},${round(entry.sales)},${round(entry.average)}`)
            })
            lines.push("Total")
            lines.push("Yearly revenue,Avg mfg run size,Ing cost per case,Avg mfg setup cost,Mfg run cost per case,Total COGS,Avg revenue per case,Avg profit per case,Avg profit margin(%)")
            lines.push(`${round(sku_entry.summary.sum_revenue)},${round(sku_entry.summary.average_run_size)},${round(sku_entry.summary.ing_cost_per_case)},${round(sku_entry.summary.average_setup_cost)},${round(sku_entry.run_cost)},${round(sku_entry.summary.cogs)},${round(sku_entry.summary.avgerage_revenue)},${round(sku_entry.summary.average_profit)},${round(sku_entry.summary.profit_margin*100)}`)
        })
    })
    return lines.join("\r\n")
}

function calculateAggregatedForOneSKU(sku_id, startDate, endDate, customer) {
    return new Promise(function(accept, reject) {
        var saleFindPromise = Sale.find({sku: sku_id}).where('year').gte(startDate.year()).lte(endDate.year())
        if (customer != null) {
            saleFindPromise = saleFindPromise.where({customer: customer})
        }
        saleFindPromise.lean()
        .then(result=> {
            var byYear = groupByYear(result)

            Object.keys(byYear).map(function(key, index) {
                var year_entries = byYear[key];
                byYear[key] = year_entries.reduce(calculateSummaryCost, {revenue: 0, sales: 0, year: key})
            });
            
            calculateSummaryStats(sku_id, Object.values(byYear), startDate, endDate).then(r => {
                accept(r)
            }).catch(reject)
        })
    }) 
}

function calculateSummaryStats(sku_id, entries, startDate, endDate) {
    return new Promise(function(accept, reject) {
        SKU.findById(sku_id).populate("product_line").lean().then(sku => {
            ManufacturingActivity.find({"sku" : sku_id, 
                $or: [ {
                    start: {
                        $gte: startDate,
                        $lt: endDate
                    }},{
                    end: {
                        $gte: startDate,
                        $lt: endDate
                    }},{
                    start: {$lte: startDate}, end: {$gte: endDate}}]
            }).lean()
            .then(activities => {
                var activity_goals = activities.map(a => a.goal_id)
                Goal.find({_id: {$in: activity_goals}}).lean().populate("skus_list.sku").then(goals => {
                    var summary = goals.reduce(calculateAvgRunSize, {run_size: 0, runs: 0, sku_id: sku_id})
                    if(goals.length == 0) {
                        summary.sku = sku
                        summary.average_run_size = 10*sku.manufacturing_rate
                    }
                    summary.average_setup_cost = summary.sku.setup_cost / summary.average_run_size
                    summary.sum_revenue = entries.reduce((total, item) => {
                        return total + item.revenue
                    }, 0)
                    summary.sum_cases = entries.reduce((total, item) => {
                        return total + item.sales
                    }, 0)
                    summary.avgerage_revenue = summary.sum_revenue / summary.sum_cases
                    calculateIngredients(summary.sku_id).then(calc => {
                        var reduced_res = calc.reduce(sumCalculatorCosts, 0)
                        summary.ing_cost_per_case = reduced_res
                        summary.cogs = summary.sku.run_cost + summary.average_setup_cost + summary.ing_cost_per_case
                        summary.average_profit = summary.avgerage_revenue - summary.cogs
                        summary.profit_margin = summary.avgerage_revenue / summary.cogs - 1
                        delete summary.sku
                        accept({sku: sku_id, entries: entries, summary: summary, pl: sku.product_line.name, name: sku.name, unit_size: sku.unit_size, count_per_case: sku.count_per_case, run_cost: sku.run_cost})
                    })
                })
            })
        })
    })
}

// @route POST api/sales/detailed/:sku_id
// request params:
// - sku_id: id of sku for detailed report
// request body fields:
// - customer: id of customer or nothing if want all customers
// - start_date: start date (MM-DD-YYYY format)
// - end_date: end date (MM-DD-YYYY format)
// - export: if true will return csv result
// returns:
// - [{sku: sku_id, entries: list of objects- each representing a weekly entry, summary: [one entry per year for 10 years]}]
router.post('/detailed/:sku_id', (req, res) => {
    var startDate = moment(req.body.start_date, 'MM-DD-YYYY')
    var endDate = moment(req.body.end_date, 'MM-DD-YYYY')
    // console.log("start date: "+ startDate.year() + " " + startDate.week())
    // console.log("end date: " + endDate.year() + " " + endDate.week())

    var saleFindPromise = Sale
        .find({
            $and: [
                { $or: [
                    {year: { $gt: startDate.year()}}, 
                    {year: startDate.year(), week: { $gte: startDate.week()}}, 
                ]},
                { $or: [
                    {year: { $lt: endDate.year() }},
                    {year: endDate.year(), week: { $lte: endDate.week()}}, 
                ]},
                { sku: req.params.sku_id }
            ]
        })
    if(req.body.customer) {
        saleFindPromise = saleFindPromise.where({customer: req.body.customer})
    }

    saleFindPromise.lean().populate("sku").populate("customer").lean().then(entries=> {
        entries.forEach(entry => {
            entry.revenue = entry.sales * entry.price_per_case
        })
        calculateSummaryStats(req.params.sku_id, entries, startDate, endDate.add(1, "days"))
        .then(r => {
            if(req.body.export) {
                let csvRes = generateCsvDetailed(r, req.body.start_date, req.body.end_date)
                res.setHeader('Content-Type', 'text/csv')
                res.status(200).send(csvRes)
            }
            else {
                res.json(r)
            }
            
        })
        .catch(err => res.json({success: false, message: err.message}))
    })
})

function generateCsvDetailed(results, start_year, end_year) {
    var lines = []
    lines.push(`Time span: ${start_year} - ${end_year}`)
    lines.push("SKU name,Year,Week,Customer number,Customer name,Sales,Price per case,Revenue")
    results.entries.forEach(entry => {
        lines.push(`${entry.sku.name},${entry.year},${entry.week},${entry.customer.number},${entry.customer.name},${entry.sales},${round(entry.price_per_case)},${round(entry.revenue)}`)
    })
    lines.push("Total")
    lines.push("Avg mfg run size,Ing cost per case,Avg mfg setup cost,Mfg run cost per case,Total COGS,Avg revenue per case,Avg profit per case,Avg profit margin(%)")
    lines.push(`${round(results.summary.average_run_size)},${round(results.summary.ing_cost_per_case)},${round(results.summary.average_setup_cost)},${round(results.run_cost)},${round(results.summary.cogs)},${round(results.summary.avgerage_revenue)},${round(results.summary.average_profit)},${round(results.summary.profit_margin*100)}`)
    return lines.join("\r\n")
}

function sumCalculatorCosts(total, item) {
    return total + item.packages * item.ingredient.cost_per_package
}

function calculateSummaryCost(total, item) {
    total.revenue += item.price_per_case * item.sales;
    total.sales += item.sales;
    total.average = total.revenue / total.sales;
    return total;
}

function calculateAvgRunSize(total, item) {
    var filtered = item.skus_list.filter(i => i.sku._id.toString() == total.sku_id.toString())
    total.run_size += filtered[0].quantity
    total.runs+= 1
    total.average_run_size = total.run_size / total.runs
    total.sku = filtered[0].sku
    return total
}

function calculateIngredients(sku_id) {
    return new Promise(function(accept, reject) {
        SKU.findById(sku_id).populate("formula").then(sku => {
            Ingredient.populate(sku, {path:"formula.ingredients_list._id"}).then(populated => {
                var calc_results = Helper.processIngredientForCalculator({skus_list: [{sku: populated, quantity: 1.0}]})
                accept(calc_results)
            }).catch(reject)
        }).catch(reject)
    })
    
}

module.exports = router;