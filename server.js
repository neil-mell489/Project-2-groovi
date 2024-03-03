const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const HabitForm = require('./models/habit_form');
const User = require('./models/user');
const methodOverride = require('method-override');
const flash = require('express-flash');
require('dotenv').config();  // Moved to the top
require('./config/database'); // Moved to the top

const app = express();

// MongoDB connection URI
const uri = process.env.MONGODB_URI;

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(flash());
app.set('view engine', 'ejs');

// Configure express-session middleware
app.use(session({
  secret: process.env.secret,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000 } // Session expires after 30 minutes
}));

// Initialize Passport.js middleware
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport.js local strategy for user authentication
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes

// Homepage route
app.get('/', isAuthenticated, async (req, res) => {
  try {
    const habits = await HabitForm.find({ user: req.user._id });
    const userName = req.user.username;
    res.render('homepage', { userName, habits });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error rendering homepage');
  }
});

// New habit form route
app.get('/new_habit', isAuthenticated, (req, res) => {
  try {
    res.render('new_habit');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error rendering new_habit page');
  }
});

// Submit habit form route
app.post('/submit-habit', isAuthenticated, async (req, res) => {
  const { title, description, days, times } = req.body;
  const newHabitForm = new HabitForm({
    title,
    description,
    days: Array.isArray(days) ? days : [days],
    times: Array.isArray(times) ? times : [times],
    user: req.user._id
  });
  try {
    await newHabitForm.save();
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving habit form');
  }
});

// Delete habit route
app.delete('/delete-habit/:id', isAuthenticated, async (req, res) => {
  const habitId = req.params.id;
  try {
    const habitToDelete = await HabitForm.findByIdAndDelete(habitId);
    if (!habitToDelete) {
      return res.status(404).send('Habit not found or you are not authorized to delete it.');
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting habit form');
  }
});


// Register route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username });
    await User.register(user, password);
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  }
});

// Login route
app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

// Render login page
app.get('/login', (req, res) => {
  res.render('login');
});

// Logout route
app.post('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) {
      console.error(err);
      res.status(500).send('Error logging out');
    } else {
      res.redirect('/login');
    }
  });
});

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
