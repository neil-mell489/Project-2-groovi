const passport = require('passport');
const User = require('../models/user');


const userController = {
  registerUser: async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = new User({ username });
      await User.register(user, password);
      res.redirect('/login');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error registering user');
    }
  },

  loginUser: (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
  },

  renderLoginPage: (req, res) => {
    res.render('login');
  },

  logoutUser: (req, res) => {
    req.logout(function(err) {
      if (err) {
        console.error(err);
        res.status(500).send('Error logging out');
      } else {
        res.redirect('/login');
      }
    });
  }
};

module.exports = userController;
