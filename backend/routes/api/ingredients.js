const express = require('express');
const router = express.Router();

// Ingredient Model
const Ingredient = require('../../models/Ingredient');

// @route GET api/ingredients
// @desc get all ingredients
// @access public
router.get('/', (req, res) => {
    Ingredient
        .find()
        .sort({date: -1})
        .then(ingredient => res.json(ingredient))
});

// @route POST api/ingredients
// @desc create an ingredient
// @access public
router.post('/', (req, res) => {
    const newIngredient = new Ingredient({
        name: req.body.name,
        number: req.body.number | new Date().valueOf(),
        vendor_info: req.body.vendor_info,
        package_size: req.body.package_size,
        cost_per_package: req.body.cost_per_package,
        comment: req.body.comment
    });

    newIngredient.save().then(ingredient => res.json(ingredient))
        .catch(err => res.status(404).json({success: false, message: err.message}));
});

// @route DELETE api/ingredients/:id
// @desc delete an ingredient
// @access public
router.delete('/:id', (req, res) => {
    Ingredient.findById(req.params.id)
        .then(ingredient => ingredient.remove().then(
            () => res.json({success: true, message: err.message}))
        ).catch(err => res.status(404).json({success: false}))
});

module.exports = router;