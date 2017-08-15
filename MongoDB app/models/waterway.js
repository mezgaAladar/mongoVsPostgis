var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define a schema
var waterwaySchema = new Schema({
    _id:  String,
    properties: {
        osm_id : Number,
	name : String,
	type : String,
	width : Number,
    },
    geometry: {
	type: Object,
      	index: '2dsphere'
   }
});
module.exports = mongoose.model('Waterway', waterwaySchema);
