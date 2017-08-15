var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define a schema
var calendarSchema = new Schema({
      uid:  String,
      from: Date,
      to : Date,
      name : String,
      place : {      
        type: Object
      , index: '2dsphere'
      }
});

module.exports = mongoose.model('Calendar', calendarSchema);
