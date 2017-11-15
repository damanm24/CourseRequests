// user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Year = new Schema({
  id: Number,
  t1: Number,
  t2: Number,
  t3: Number,
  name: String,
  current: Number,
  current_graded: Number
});


module.exports = mongoose.model('year', Year);