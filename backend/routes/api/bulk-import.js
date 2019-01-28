const express = require('express');
const router = express.Router();

var Parser = require('../../bulk_import/parser');

// @route POST api/bulk-import
// @desc create an ingredient
// @access public
router.post('/upload', (req, res) => {
    Parser.parseSkuFile()
    .then(result => res.json(result))
    .catch(err => { 
        console.log(err);
        res.status(404).json({success: false, message: err.message})});
});

module.exports = router;