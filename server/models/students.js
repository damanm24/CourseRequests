// students model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Student = new Schema({
  id: Number,
  firstname: String,
  lastname: String,
  login: String,
  gradyear: Number
});


module.exports = mongoose.model('student', Student);