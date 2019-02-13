const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const ManufacturingLine = require('../../models/ManufacturingLine');

// @route GET api/manufacturinglines
// @desc get all manufacturing lines
// @access public
router.get('/', (req, res) => {
    ManufacturingLine
        .find()
        .lean()
        .then(mLs => res.json(mLs))
});

function checkManufacturingLine(obj) {
    if(!(obj.name) || !(obj.shortname)) 
        throw new Error(`Manufacturing line name and shortname required. Got: ${obj.name},${obj.shortname}`)
    if(obj.name.length > 32) 
        throw new Error(`Manufacturing line name must be less than 32 characters. Got length ${obj.name.length} for: ${obj.name}`)
    if(obj.shortname.length > 5)
        throw new Error(`Manufacturing line shortname must be less than 5 characters. Got length ${obj.shortname.length} for ${obj.shortname}`)
}

// @route POST api/manufacturinglines
// @desc create a manufacturing line
// @access public
router.post('/', (req, res) => {
    const mLObj = {
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        shortname: req.body.shortname,
        comment: req.body.comment
    };

    try {
        checkManufacturingLine(mLObj);
    } catch(error) {
        res.status(404).json({success: false, message: error.message})
        return;
    }
        
    const newManufacturingLine = new ManufacturingLine(mLObj);

    ManufacturingLine.findOne({shortname: mLObj.shortname}).then(ml => {
        if(ml !== null) {
            res.status(404).json({success: false, message: "Manufacturing line shortname is not unique: " + mLObj.shortname})
        }
        else {
            newManufacturingLine.save().then(ml => res.json(ml))
            .catch(err => res.status(404).json({success: false, message: err.message}));
        }
    })
});

// @route POST api/manufacturinglines/update/:id
// @desc updates a manufacturing line
// @access public
router.post('/update/:id', (req, res) => {
    ManufacturingLine.findById(req.params.id).then(ml => {
        new_ml = {
            name: req.body.name != null ? req.body.name : ml.name,
            shortname: req.body.shortname != null ? req.body.shortname : ml.shortname
        }

        if(ml.comment || req.body.comment) {
            new_ml.comment = req.body.comment != null ? req.body.comment : ml.comment;
        }

        try {
            checkManufacturingLine(new_ml)
        } catch(err) {
            res.status(404).json({success: false, message: err.message})
            return;
        }

        ManufacturingLine.findOne({shortname: new_ml.shortname}).then(ml_old => {
            if(ml_old !== null && ml_old._id != req.params.id) {
                res.status(404).json({success: false, message: `Manufacturing line shortname is not unique: ${new_ml.shortname}`})
            }
            else {
                ManufacturingLine.findByIdAndUpdate(req.params.id, {$set:new_ml}, {new: true})
                    .then(() => res.json({success: true}))
                    .catch(err => res.status(404).json({success: false, message: err.message}));
            }
        })
    })
})

// @route DELETE api/manufacturinglines/:id
// @desc delete a manufacturing line
// deletes all occurances of the manufacturing line in all sku
// @access public
router.delete('/:id', (req, res) => {
    SKU.find({"manufacturing_lines._id": req.params.id}).lean().then(sku_matches => {
        Promise.all(sku_matches.map(function(sku) {
            return new Promise(function(accept, reject) {
                new_list = sku.manufacturing_lines.filter(function( obj ) {
                    return obj._id.toString() !== req.params.id;
                });
                SKU.findByIdAndUpdate(sku._id, {manufacturing_lines: new_list}).then(accept).catch(reject)
            })
        })).then(results => {
            ManufacturingLine.findById(req.params.id)
                .then(ml => ml.remove().then(
                    () => res.json({success: true}))
                ).catch(err => res.status(404).json({success: false, message: err.message}))
        }).catch(err => res.status(404).json({success: false, message: err.message}))
    })
});

module.exports = router;