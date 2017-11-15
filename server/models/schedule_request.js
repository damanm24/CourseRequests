var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Schedule_Request = new Schema({
    username: String,
    request: Schema.Types.Mixed
});




module.exports = mongoose.model('Schedule_Request', Schedule_Request);