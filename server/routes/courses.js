var express = require('express');
var router = express.Router();

var Courses = require('../models/courses.js');
var Schedule_Request = require('../models/schedule_request.js');


router.get('/getCourses', function (req, res) {
    Courses.find({}, function (err, foundCourses) {
        if (err) throw err;
        if (foundCourses) {
            res.json(foundCourses);
        } else {
            res.status(500).json({ err: "Cannot find existing courses" });
        }
    });
});


module.exports = router;