var passport=require('passport');
var FaceBookStrategy=require('passport-facebook').Strategy;
var secret=require('../config/secret');
var User=require('../models/user');
var async=require('async');
var request=require('request');

//Serialize User
passport.serializeUser(function(user,done){
    done(null,user.id);
});

//Deserialize User
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        done(err,user);
    });
});


passport.use(new FaceBookStrategy(secret.facebook,function(req,token,refreshToken,profile,done){
    //Finds User
    User.findOne({
        facebook:profile.id
    },function(err,user){
        //Throw Erro
        if(err) return done(err);
//If user exists return user Object
        if(user){
            req.flash('loginMessage','Successfully Logged with facebook')
            return done(null,user);
//Else Create a new user
        }else{
           async.waterfall([
               function(callback){
                var newUser=new User();
                newUser.email=profile._json.email;
                newUser.facebook=profile.id;
                newUser.token.push({kind:'facebook',token:token});
                newUser.profile.name=profile.displayName;
                newUser.profile.picture='https://graph.facebook.com/'+profile.id+'/picture?type=large';
    //saves user
                newUser.save(function(err){
    if(err) throw err;
    req.flash('loginMessage','Successfully Logged in')
    callback(err,newUser);
                });
               },
               /*
               TODO:
               add if else statement to prevent null values from being added to mail chim
               */
               function(newUser,callback){
request({
    url:'https://us17.api.mailchimp.com/3.0/lists/6679ba2522/members',
    method:'POST',
    headers:{
        'Authorization':'randomUser 77c6ff05bfab57a23787a2f590537c73-us17',
        'Content-Type':'application/json'
    },
    json:{
        'email_address': newUser.email,
        'status': 'subscribed'
    }
},function(err,res,body){
if(err){
    return done(err,newUser);
}
else{
    console.log('Success');
    return done(null,newUser);
}
})
               }
           ])
        }
    })
}))