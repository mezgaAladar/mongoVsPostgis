var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define a schema
//SÉMA (users)
var citySchema = new Schema({
    properties: {
	CITY_NAME : String,
	GMI_ADMIN : String,
	ADMIN_NAME : String,
	FIPS_CNTRY : Boolean,
	CNTRY_NAME : String,
	STATUS :  String,
	POP_RANK : Number,
	POP_CLASS : String,
	PORT_ID : Number
    },
    geometry: {
	type: Object,
      	index: '2dsphere'
   }
});
module.exports = mongoose.model('City', citySchema);
