var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define a schema
var countrySchema = new Schema({
    properties: {
	ISO_2DIGIT : String,
	ISO_3DIGIT : String,
	CNTRY_NAME : String,
	POP_CNTRY : Number
    },
    geometry: {
	type: Object,
      	index: '2dsphere'
   }
});
module.exports = mongoose.model('Country', countrySchema);
