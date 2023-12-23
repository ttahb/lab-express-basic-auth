const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const {isLoggedIn, isLoggedOut} = require('../middlewares/route-guard');
const saltRounds = 10;


//signup - render the signup form
router.get('/signup',isLoggedOut, (req, res)=>{
    console.log("req.session Signup", req.session);
    res.render('auth/signup.hbs');
});

//signup - accept the submitted form
router.post('/signup',isLoggedOut, (req, res, isLoggedOut)=>{
    const {username, email, password} = req.body;

    User.findOne({username})
        .then(foundUser=>{
            if(foundUser){
                console.log('User exists already!')
                res.render('auth/signup', {error:`Username ${foundUser.username} already exists! :(`});
            } else {
                //Registering the user 
                bcrypt.hash(password, saltRounds, (err, hash)=>{
                    if(err){
                        return res.render('error');
                    } else {
                        console.log('hashed pwd - ',hash );
                        return  User.create({username, email, password:hash})
                        .then((user)=> {
                            req.session.currentUser = user;
                            res.redirect(`/profile/${user.username}`)
                            res.render('auth/profile', user);
                        })
                        .catch(err=>console.log('error while creating user', err));
                    }
                  
                })                        
            }
        })
        .catch(err=> console.log(err));

});


router.get('/login',isLoggedOut, (req, res)=>{
    console.log("req.session", req.session);
    res.render('auth/login');
});

router.post('/login',isLoggedOut, (req, res,next)=>{
    console.log('Entered login ')
    console.log('req.session', req.session);
    const {email, password} = req.body;

    if(email === '' || password === ''){
        res.render('auth/login', {errorMessage:'Please enter both email and password.:('});
        return;
    }

    User.findOne({email})
        .then(user=> {
            if(!user){
                console.log('Email not registered!');
                res.render('auth/login', {errorMessage: 'User not found or password incorrect'});
                return;
            } else if(bcrypt.compareSync(password, user.password)) {
                console.log('User authentication success', req.session);
                //******* SAVE THE USER IN THE SESSION ********//
                req.session.currentUser = user;

                // res.render('auth/profile', user);
                res.redirect('/profile')
            } else {
                console.log('User auth failed due to incorrect password');
                res.render('auth/login', {errorMessage:'User not found or password incorrect'});
                
            }
        })  
        .catch(err=>console.log(err));

});

router.post('/logout',isLoggedIn, (req, res, next) => {
    console.log('logout invoked...')
    req.session.destroy(err => {
      if (err) next(err);
      console.log('no error while killing session, redirecting ')
      res.redirect('/');
    });
  });


router.get("/profile",isLoggedIn, (req, res, next) => {
    console.log("req.session", req.session)
    res.render("auth/profile", req.session.currentUser);
});


module.exports = router;