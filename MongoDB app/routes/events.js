var express = require('express');
var router = express.Router();

/*
 * GET places (list)
 */
router.get('/events', function(req, res) {
    var db = req.db;
    db.collection('events').find().toArray(function (err, items) {
        res.json(items);
    });
});

module.exports = router;
