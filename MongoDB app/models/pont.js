var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define a schema
var pontSchema = new Schema({
      _id:  String,
      geometry : {      
        type: Object
      , index: '2dsphere'
      }
});

module.exports = mongoose.model('Pont', pontSchema);
