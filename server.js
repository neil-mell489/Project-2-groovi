// server.js

require('dotenv').config(); 
require('./config/database'); 
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('express-flash');
const User = require('./models/user');
const HabitForm = require('./models/habit_form');
const userController = require('./controllers/userController');
const habitController = require('./controllers/habitController');
const journalController = require('./controllers/journalController')


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
app.post('/update-habit/:id', isAuthenticated, habitController.updateHabit);
app.post('/register', userController.registerUser);
app.post('/login', userController.loginUser);
app.get('/login', userController.renderLoginPage);
app.post('/logout', userController.logoutUser);

// Define the route for /journal
app.get('/journal', isAuthenticated, journalController.getJournalPage);
// Define the route for /new_journal to render the new journal entry form
app.get('/new_journal', isAuthenticated, journalController.getNewJournalForm);
// Submit a new journal entry
app.post('/submit-journal', isAuthenticated, journalController.submitJournalForm);
// Route to render the edit journal entry form
app.get('/edit-journal/:id', isAuthenticated, journalController.getEditJournalForm);
// Route to update the journal entry
app.put('/update-journal/:id', isAuthenticated, journalController.updateJournalEntry);
// Route to delete the journal entry
app.post('/delete-journal/:id', isAuthenticated, journalController.deleteJournalEntry);
// Route to handle submitting the updated journal entry
app.post('/update-journal/:id', isAuthenticated, journalController.updateJournalEntry);
// Route to render the journal_show page for a specific journal entry
app.get('/journal_show/:id', isAuthenticated, journalController.getJournalEntry);
// Route to render the show_habit page for a specific habit entry
app.get('/show_habit/:id', isAuthenticated, habitController.showHabit);


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
