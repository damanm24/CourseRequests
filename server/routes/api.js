var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user.js');
var Students = require('../models/students.js');
var Schedule_Request = require('../models/schedule_request.js');


router.post('/register', function (req, res) {
  Students.findOne({ firstname: req.body.firstname, lastname: req.body.lastname, gradyear: req.body.gradyear }, function (err, foundStudent) {
    if (err) throw err;
    if (foundStudent) {
      User.register(new User({ username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, gradyear: req.body.gradyear }),
        req.body.password, function (err, account) {
          if (err) {
            return res.status(500).json({
              err: err
            });
          }
          passport.authenticate('local')(req, res, function () {
            return res.status(200).json({
              status: 'Registration successful!'
            });
          });
        });
    } else {
      res.status(500).json({ err: "Cannot find this existing student" });
    }
  })

});

router.post('/update', function (req, res) {
  Students.findOne({ firstname: req.body.firstname, lastname: req.body.lastname, gradyear: req.body.gradyear }, function (err, foundStudent) {
    if (err) throw err;
    if (foundStudent) {
      foundStudent.courseRequest = req.body.courseRequest;
      foundStudent.save(function (err, updatedStudent) {
        if (err) throw err;
        res.send(updatedStudent);
      })
    } else {
      res.status(500).json({ err: "Cannot find this existing student" });
    }
  })

});

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      res.status(200).json({
        status: 'Login successful!',
        user: user
      });
    });
  })(req, res, next);
});

router.get('/logout', function (req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

router.get('/status', function (req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true,
    user: req.user
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