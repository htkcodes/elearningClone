var express = require('express');
var router = express.Router();
var passport=require('passport');
var passportConf=require('../config/passport');
var User=require('../models/user');
var Course=require('../models/courses');
var async=require('async');

router.get('/login',function(req,res,next){
  res.render('login');
})
/* Authethicate User */
router.get('/auth/facebook',passport.authenticate('facebook',{scope:'email'}));

/* Once user has been authethicated redirect to specificied location */
router.get('/auth/facebook/callback',passport.authenticate('facebook',{
 // successfulRedirect:'/',
  failureRedirect:'/users/login'
}),function(req,res){
  res.redirect('/users/profile')
});
router.get('/logout',function(req,res,next){
  req.logOut();
  res.redirect('/')
})

router.get('/profile',ensureAuth,function(req,res,next){
  res.render('profile'),{message:req.flash('loginMessage')};
})

//Become instructor Route
router.get('/teacher/become-an-instructor',function(req,res,next){
res.render('become-an-instructor');
})

router.post('/teacher/become-an-instructor',function(req,res,next){
async.waterfall([
  function(callback)
  {
    let course = new Course();
    course.title=req.body.title;
    course.desc=req.body.desc;
    course.price=req.body.price;
    course.wistiaId=req.body.wistiaId;
    course.ownByTeacher=req.user._id;
    course.save(function(err){
      callback(err,course);
    })

  },
  function(course,callback)
  {
    User.findOne({_id:req.user._id},function(err,foundUser){
      console.log(foundUser);
       foundUser.role="teacher";
      foundUser.coursesTeach.push({course:course._id});
      foundUser.save(function(err){
        if(err)return next(err)
        res.redirect('/users/teacher/teacher-dashboard');
      });
    });
  }

])
})

router.get('/teacher/teacher-dashboard',function(req,res,next){
User.findOne({
  _id:req.user._id
})
.populate('coursesTeach.course')
.exec(function(err,foundUser){
  console.log(foundUser);
  res.render('teacher-dashboard',{foundUser:foundUser});
});
});

//Become instructor Route
router.get('/teacher/create',function(req,res,next){
  res.render('become-an-instructor');
  })
  
  router.post('/teacher/create',function(req,res,next){
  async.waterfall([
    function(callback)
    {
      let course = new Course();
      course.title=req.body.title;
      course.desc=req.body.desc;
      course.price=req.body.price;
      course.wistiaId=req.body.wistiaId;
      course.ownByTeacher=req.user._id;
      course.save(function(err){
        callback(err,course);
      })
  
    },
    function(course,callback)
    {
      User.findOne({_id:req.user._id},function(err,foundUser){
        foundUser.coursesTeach.push({course:course._id});
        foundUser.save(function(err){
          if(err)return next(err)
          res.redirect('/users/teacher/teacher-dashboard');
        });
      });
    }
  
  ])
  })

  router.get('/teacher/edit-course/:id',function(req,res,next){
    Course.findOne({_id:req.params.id},function(err,foundCourse){
      res.render('edit-course',{course:foundCourse});
    })
  })  
  
  router.post('/teacher/edit-course/:id',function(req,res,next){
    Course.findOne({_id:req.params.id},function(err,foundCourse){
      if(foundCourse){
        if(req.body.title) foundCourse.title=req.body.title;
        if(req.body.wistiaId) foundCourse.wistiaId=req.body.wistiaId;
        if(req.body.price) foundCourse.price=req.body.price;
        if(req.body.desc) foundCourse.desc=req.body.desc;
      }
      foundCourse.save(function (err) 
      {
if(err)return next(err);
res.redirect('/users/teacher/teacher-dashboard');  
      })
    })
  })
  


  router.get('/teacher/revenue',function(req,res,next){
  var revenue=0;
    User.findOne({_id:req.user._id},function(err,foundUser){
      
foundUser.revenue.forEach(function(value){
revenue+=value;
});

      res.render('revenue',{revenue:revenue});
    })
  })  
  

function ensureAuth(req,res,next){
  if(req.isAuthenticated()){
    console.log(req.isAuthenticated());
    return next();
  }
  res.redirect('/users/login');
}

module.exports = router;
