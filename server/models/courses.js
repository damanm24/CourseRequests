// user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Courses = new Schema({
  id: Number,
  name: String,
  sisid: Number,
  description: String,
  term_id: Number,
  needalt: Number,
  graded: Number,
  short_name: String,
  catalog: Number,
  offering: Number,
  subdiscipline: String,
  required: Number,
  gradelevels: String,
  requirements: String,
  department_id: String,
  shortname: String,
  archived: Number,
  credits: Number,
  sort_tier: Number
});


module.exports = mongoose.model('courses', Courses);