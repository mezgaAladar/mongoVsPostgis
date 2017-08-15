var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define a schema
var placeSchema = new Schema({
   _id:  String,
  zip: Number,
    loc: {
	type: Object
    , 	index: '2dsphere'
  }
});
module.exports = mongoose.model('Place', placeSchema);
