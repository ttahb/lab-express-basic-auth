// middleware/route-guard.js

// checks if the user is logged in when trying to access a specific page
const isLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
      console.log('in if block')
      return res.redirect('/login');
    }
    console.log('in else block')
    next();
  };
  
  // if an already logged in user tries to access the login page it
  // redirects the user to the home page
  const isLoggedOut = (req, res, next) => {
    if (req.session.currentUser) {
      return res.redirect('/');
    }
    next();
  };

  const isAdmin = (req, res, next) => {
    if(req.session.currentUser && req.session.currentUser.role == 'admin'){
      next();
    } else {
      return res.redirect('/profile');
    }
  };
  
  module.exports = {
    isLoggedIn,
    isLoggedOut,
    isAdmin
  };
  