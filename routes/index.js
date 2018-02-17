var express = require('express');
var router = express.Router();
var Course = require('../models/courses');
var async = require('async');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/courses', function (req, res, next) {
  Course.find({}, function (err, courses) {
    res.render('courses', {
      courses: courses
    })
  })
})

router.get('/courses/:id', function (req, res, next) {
  async.parallel([
    function (callback) {
      Course.findOne({
        _id: req.params.id
      }, function (err, foundCourse) {
        callback(err, foundCourse)
      })
    },
    function (callback) {
      User.findOne({
          _id: req.user._id,
          'coursesTaken.course': req.params.id
        })
        .populate('coursesTaken.course')
        .exec(function (err, foundUserCourse) {
          callback(err, foundUserCourse)
        })
    },
    function (callback) {
      User.findOne({
          _id: req.user._id,
          'coursesTeach.course': req.params.id
        })
        .populate('coursesTeach.course')
        .exec(function (err, foundUserCourse) {
          callback(err, foundUserCourse)
        })
    }
  ], function (err, results) {
    var course = results[0];
    var userCourse = results[1];
    var teacherCourse = results[2];

    if (userCourse === null && teacherCourse === null) {
      res.render('course-desc', {
        course: course
      })
    } else if (userCourse === null && teacherCourse !== null) {
      res.render('course', {
        course: course
      });
    } else {
      res.render('course', {
        course: course
      });
    }
  })
})
module.exports = router;