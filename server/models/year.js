// year model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Year = new Schema({
  id: Number,
  name: String,
  current: Number,
  current_graded: Number
});


module.exports = mongoose.model('year', Year);