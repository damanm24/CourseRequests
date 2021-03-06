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
module.exports = router;