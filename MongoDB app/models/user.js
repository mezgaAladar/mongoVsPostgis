var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define a schema
//SÉMA (users)
var userSchema = new Schema({
   _id:  String,
  pass: String,
  email:   String,
  public_events: [String]
});

module.exports = mongoose.model('User', userSchema);
