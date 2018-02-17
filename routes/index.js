var express = require('express');
var router = express.Router();
var Course = require('../models/courses');
var User = require('../models/user')
var async = require('async');
var stripe = require('stripe')('sk_test_3KpLael8jWqMPQ1C71zVe4XS');

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
        })
        .populate('ownByStudent.user')
        .exec(function (err, foundCourse) {
          callback(err, foundCourse)
        });
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
      console.log(course);
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

router.post('/payment', function (req, res, next) {

  var stripeToken = req.body.stripeToken;
  var courseId = req.body.courseId;
  async.waterfall([
    function (cb) {
      Course.findOne({
        _id: courseId
      }, function (err, foundCourse) {
        if (foundCourse) {
          cb(err, foundCourse);
        }
      })
    },
    function (foundCourse,cb) {
      stripe.customers.create({
        source: stripeToken,
        email: req.user.email
      }).then(function (customer) {
        return stripe.charges.create({
          amount: foundCourse.price,
          current: 'usd',
          customer: customer.id
        }).then(function (charge) {
          async.parallel([
            function (cb) {
              Course.update({
                _id: courseId,
                'ownByStudent.user': {
                  $ne: req.user._id
                }
              }, {
                $push: {
                  ownByStudent: {
                    user: req.user._id
                  }
                },
                $inc: {
                  totalStudents: 1
                }
              }, function (err, count) {
                if (err) return next(err);
                cb(err);
              });
            },
            function (cb) {
              User.update({
                _id: req.user._id,
                'coursesTaken.course': {
                  $ne: courseId
                }
              }, {
                $push: {
                  coursesTaken: {
                    course: courseId
                  }
                }
              }, function (err, count) {
                if (err) return next(err)
                cb(err)
              });
            },
            function (cb) {
              User.update({
                  _id: foundCourse.ownByTeacher
                }, {
                  $push: {
                    revenue: {
                      money: foundCourse.price
                    }
                  }
                },
                function (err, count) {
                  if (err) return next(err);
                  cb(err);
                }
              )}
          ])
        })
      })
    }], function (err, results) {
    if (err) return next(err);
    res.redirect('/courses/' + courseId)
  })


})
module.exports = router;