var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define a schema
var pontokSchema = new Schema({
      properties: {	//Itt valamiért ha definiálom, nem dobja ki
      },
      geometry : {      
        type: Object
      , index: '2dsphere'
      }
});

module.exports = mongoose.model('Pontok', pontokSchema);
