var express = require('express');
var router = express.Router();

/*
 * GET places (list)
 */
router.get('/places', function(req, res) {
    var db = req.db;
    db.collection('places').find().toArray(function (err, items) {
        res.json(items);
    });
});

module.exports = router;
