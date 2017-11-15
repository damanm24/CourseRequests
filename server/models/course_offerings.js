// course_offerings model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Course_Offerings = new Schema({
  id: Number,
  course_id: String,
  year_id: Number,
  grade_level_ids: null,
  description: String,
  created_at: String,
  updated_at: String,
  sort_order: Number,
  info: null,
  gradelevels: String
});


module.exports = mongoose.model('course_offerings', Course_Offerings);