const express = require('express');
const router = express.Router();


router.get('/profile/:username', (req, res)=>{
    res.render('auth/profile', {username:req.params.username});
});

module.exports = router;