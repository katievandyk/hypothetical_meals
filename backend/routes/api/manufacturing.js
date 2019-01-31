const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Papa = require('papaparse');

// Goal Model
const Goal = require('../../models/Goal');

// @route GET api/manufacturing
// @desc get all goals
// @access public
router.get('/', (req, res) => {
    Goal
        .find()
        .populate({ path: 'skus_list.sku'})
        .lean()
        .then(goal => res.json(goal))
});

// @route POST api/manufacturing
// @desc create a goal
// @access public
router.post('/', (req, res) => {
    const newGoal = new Goal({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        skus_list: req.body.skus_list
    });

    newGoal.save().then(goal => res.json(goal))
        .catch(err => res.status(404).json({success: false, message: err.message}));
});

// @route POST api/manufacturing/ingquantities/:id
// @desc get quantities of all ingredients needed for manufacturing goal
// @access public
router.get('/ingquantities/:id', (req, res) => {
    Goal.aggregate(
        [ { $match: {'_id': mongoose.Types.ObjectId(req.params.id) }},
          { $project: { skus_list: "$skus_list"} },
          { $unwind: "$skus_list" },
          { $replaceRoot: { newRoot: "$skus_list" } },
          {
              $lookup: {
                  from: 'skus',
                  localField: 'sku',
                  foreignField: '_id',
                  as: 'sku'
              } },
          { $project: {"_id": {"$map": { "input": "$sku",
                                      "as": "row",
                                       "in": {
                                            "ingredient": {
                                             "$map": { "input": "$$row.ingredients_list",
                                                        "as": "rowrow",
                                                         "in": {
                                                          "_id": { "$ifNull": [ "$$rowrow._id", "" ] },
                                                          "quantity": { "$multiply": [
                                                                 { "$ifNull": [ "$$rowrow.quantity", 0 ] },
                                                                 { "$ifNull": [ "$quantity", 0 ] }
                                                               ]}
                                                        }}}
            }}}}},
          { $unwind: "$_id" },
          { $replaceRoot: { newRoot: "$_id" } },
          { $unwind: "$ingredient" },
          { $replaceRoot: { newRoot: "$ingredient" } },
          { $group: { _id: "$_id", quantity: { $sum: "$quantity" }} },
          {
              $lookup: {
                  from: 'ingredients',
                  localField: '_id',
                  foreignField: '_id',
                  as: 'ingredient'
              } },
          { $project: { _id: 0, ingredient: 1, quantity: 1} },
        ]
    ).then(result => res.json(result))
    .catch(err => res.status(404).json({success: false, message: err.message}));
});


// @route GET api/manufacturing/export/:id
// @desc export a goal
// @access public
router.get('/export/:id', (req, res) => {
        Goal.aggregate(
            [ { $match: {'_id': mongoose.Types.ObjectId(req.params.id) }},
              { $project: { skus_list: "$skus_list"} },
              { $unwind: "$skus_list" },
              { $replaceRoot: { newRoot: "$skus_list" } },
              {
                   $lookup: {
                       from: 'skus',
                       localField: 'sku',
                       foreignField: '_id',
                       as: 'sku'
                   } },
              { $unwind: "$sku" },
              { $project: { _id: 0, "SKU Name": "$sku.name", "Quantity": "$quantity"} },
            ]
         ).then(result => {
             var csv = Papa.unparse(result)
              res.setHeader('Content-Type', 'text/csv')
              res.status(200).send(csv)
         }).catch(err => res.status(404).json({success: false, message: err.message}));
});


module.exports = router;
