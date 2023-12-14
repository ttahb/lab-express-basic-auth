const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const saltRounds = 10;


//signup - render the signup form
router.get('/signup', (req, res)=>{
    res.render('auth/signup.hbs');
});

//signup - accept the submitted form
router.post('/signup', (req, res)=>{
    const {username, password} = req.body;

    User.findOne({username})
        .then(foundUser=>{
            if(foundUser){
                res.render('auth/signup', {error:`Username ${foundUser.username} already exists! :(`});
            } else {
                bcrypt.hash(password, saltRounds, (err, hash)=>{
                    if(err){
                        return res.render('error');
                    } else {
                        return  User.create({username, password:hash})
                        .then((user)=> res.redirect(`/profile/${user.username}`))
                        .catch(err=>console.log('error while creating user', err));
                    }
                  
                })                        
            }
        })
        .catch(err=> console.log(err));

});



module.exports = router;