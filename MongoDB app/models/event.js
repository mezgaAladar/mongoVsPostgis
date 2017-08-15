var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define a schema
//SÉMA (users)
var eventSchema = new Schema({
    _id:  String,
    name: String,
    from : Date,
    to : Date,
    place : String

});

module.exports = mongoose.model('Event', eventSchema);
