// user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Year = new Schema({
  id: Number,
  name: String,
  short_name: String
});


module.exports = mongoose.model('year', Year);