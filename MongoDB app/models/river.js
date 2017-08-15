var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define a schema
var riverSchema = new Schema({
    properties: {
	NAME : String
    },
    geometry: {
	type: Object,
      	index: '2dsphere'
   }
});
module.exports = mongoose.model('River', riverSchema);
