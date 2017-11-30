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

router.post('/submit/:username', function (req, res) {
  Schedule_Request.findOne({ username: req.params.username }, function (err, doc) {
    if (!doc) {
      Schedule_Request.create({ username: req.params.username, request: req.body.newStudentObject }, function (err, doc) {
        if (err) {
          res.status(500).json({
            error: err
          })
          console.log(err);
        }
        console.log("Success Creating");
      })
    }
    if (doc) {
      doc.request = req.body.newStudentObject;
      doc.save(function (err) {
        if (err) {
          res.status(500).json({
            error: err
          })
          console.log(err);
        }
        console.log("Success updating");
      })
    }
  })
  res.status(200);
});

router.get('/getRequestStatus', function (req, res) {
  Schedule_Request.findOne({ username: req.user.username }, function (err, doc) {
    if (!doc) {
      console.log(err);
      res.status(500).json({
        error: err
      })
    }
    res.status(200).json({
      response: doc
    })
  });
});

router.get('/getAllRequests', function (req, res) {
  Schedule_Request.find({}, function (err, requests) {
    if (err) {
      console.log(err);
      res.status(500).json({
        error: err
      });
    }
    res.status(200).json({
      response: requests
    })
  })
});

router.post('/updateRequest/:id', function (req, res) {
  var newRequest = JSON.parse(req.body.newRequest);
  Schedule_Request.findByIdAndUpdate({ _id: req.params.id }, { $set: { request: newRequest.request }}, function (err, updated) {
    if (err) {
      console.log(err);
      res.status(500).json({
        error: err
      });
    }
    Schedule_Request.find({}, function (err, docs) {
      if (err) {
        console.log(err);
        res.status(200).json({
          response: docs
        })
      }
    });
  });
});


module.exports = router;