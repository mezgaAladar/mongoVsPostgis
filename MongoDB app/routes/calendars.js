var express = require('express');
var router = express.Router();

/*
 * GET places (list)
 */
router.get('/calendars', function(req, res) {
    var db = req.db;
    db.collection('calendars').find().toArray(function (err, items) {
        res.json(items);
    });
});

module.exports = router;
