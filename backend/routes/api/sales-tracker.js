const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Helper = require('../../bulk_import/helpers');
const Track = require('../../sales_tracking/track')
const SKU = require('../../models/SKU')
const Sale = require('../../models/Sale')
const ManufacturingActivity = require('../../models/ManufacturingActivity')
const Goal = require('../../models/Goal')


function groupByYear(res) {
    return res.reduce(function(r,a) {
        r[a.year] = r[a.year] || [];
        r[a.year].push(a);
        return r;
    }, Object.create(null))
}

// @route POST api/sales/sumnmary
// request body fields:
// - skus: list of sku ids to get sales summary for
// returns:
// - [{sku: sku_id, entries: list of objects- each representing aggregated calculations for one year, summary: [one entry per year for 10 years]}]
router.post('/summary', (req, res) => {
    Promise.all(req.body.skus.map(sku_id => {
        return calculateAggregatedForOneSKU(sku_id, 2009, 2019)
    })).then(results => {
        res.json(results)
    })
})

function calculateAggregatedForOneSKU(sku_id, start_year, end_year) {
    return new Promise(function(accept, reject) {
        Sale.find({sku: sku_id}).where('year').gte(start_year).lte(end_year).lean()
        .then(result=> {
            var byYear = groupByYear(result)

            Object.keys(byYear).map(function(key, index) {
                var year_entries = byYear[key];
                byYear[key] = year_entries.reduce(calculateSummaryCost, {revenue: 0, sales: 0, year: key})
            });
            
            calculateSummaryStats(sku_id, Object.values(byYear)).then(r => accept(r)).catch(reject)
        })
    }) 
}

function calculateSummaryStats(sku_id, entries) {
    return new Promise(function(accept, reject) {
        SKU.findById(sku_id).then(sku => {
            ManufacturingActivity.find({"sku" : sku_id}).lean()
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
                    calculateIngredients(goals, summary.sku_id).then(calc => {
                        var reduced_res = calc.reduce(sumCalculatorCosts, 0)
                        summary.cogs = summary.sku.run_cost + summary.average_setup_cost + reduced_res
                        summary.avgerage_profit = summary.avgerage_revenue - summary.cogs
                        summary.profit_margin = summary.avgerage_revenue / summary.cogs - 1
                        delete summary.sku
                        accept({sku: sku_id, entries: entries, summary: summary})
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
// - start_year: start year
// - end_year: end year
// returns:
// - [{sku: sku_id, entries: list of objects- each representing a weekly entry, summary: [one entry per year for 10 years]}]
router.post('/detailed/:sku_id', (req, res) => {
    var saleFindPromise = Sale.find({sku: req.params.sku_id}).where('year').gte(req.body.start_year).lte(req.body.end_year)
    if(req.body.customer) {
        saleFindPromise = saleFindPromise.where({customer: req.body.customer})
    }

    saleFindPromise.lean().populate("sku").then(entries=> {
        entries.forEach(entry => {
            entry.revenue = entry.sales * entry.price_per_case
        })
        calculateSummaryStats(req.params.sku_id, entries).then(r => res.json(r)).catch(err => res.json({success: false}))
    })
})

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

function calculateIngredients(goals, sku_id) {
    if (goals.length > 0) {
        var goal = goals[0] 
        return new Promise(function(accept, reject) {
            Formula.populate(goal, {path:"skus_list.sku.formula"}).then(f_pop => {
                Ingredient.populate(f_pop, {path:"skus_list.sku.formula.ingredients_list._id"})
                .then(populated => {
                    populated.skus_list = populated.skus_list.filter(i => i.sku._id.toString() == sku_id.toString())
                    var calc_results = Helper.processIngredientForCalculator(populated)
                    accept(calc_results)
                })
            })
        })
    }
    else
        return new Promise(function(accept, reject) {
            accept([])
        })
}

module.exports = router;