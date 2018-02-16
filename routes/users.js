var express = require('express');
var router = express.Router();
var passport=require('passport');
var passportConf=require('../config/passport');

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


router.get('/become-instructor',function(req,res,next){

})

router.post('/become-instructor',function(req,res,next){

})


function ensureAuth(req,res,next){
  if(req.isAuthenticated()){
    console.log(req.isAuthenticated());
    return next();
  }
  res.redirect('/users/login');
}

module.exports = router;
