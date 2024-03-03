// server.js

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('express-flash');
const User = require('./models/user');
const HabitForm = require('./models/habit_form');
require('dotenv').config();  // Moved to the top
require('./config/database'); // Moved to the top
const habitController = require('./controllers/habitController');
const userController = require('./controllers/userController');

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
app.get('/', isAuthenticated, habitController.getHomepage);
app.get('/new_habit', isAuthenticated, habitController.getNewHabitForm);
app.post('/submit-habit', isAuthenticated, habitController.submitHabitForm);
app.delete('/delete-habit/:id', isAuthenticated, habitController.deleteHabit);
app.get('/edit-habit/:id', isAuthenticated, habitController.getEditHabitForm); // Corrected route
app.put('/update-habit/:id', isAuthenticated, habitController.updateHabit); // Route to handle updating habit
app.post('/register', userController.registerUser);
app.post('/login', userController.loginUser);
app.get('/login', userController.renderLoginPage);
app.post('/logout', userController.logoutUser);

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
