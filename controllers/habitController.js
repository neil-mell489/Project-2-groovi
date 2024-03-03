// habitController.js

const HabitForm = require('../models/habit_form');

// Render the homepage with the logged-in user's habits
exports.getHomepage = async (req, res) => {
    try {
      // Fetch only the habits associated with the logged-in user
      const habits = await HabitForm.find({ user: req.user._id });
      // Pass the user's name to the template
      res.render('homepage', { habits, userName: req.user.username });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching habits');
    }
  };
  

// Render the form for creating a new habit
exports.getNewHabitForm = (req, res) => {
  res.render('new_habit');
};

// Submit a new habit
exports.submitHabitForm = async (req, res) => {
  const { title, description, days, times } = req.body;
  try {
    await HabitForm.create({
      title,
      description,
      days: Array.isArray(days) ? days : [days],
      times: Array.isArray(times) ? times : [times],
    });
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating new habit');
  }
};

// Delete a habit
exports.deleteHabit = async (req, res) => {
  try {
    const deletedHabit = await HabitForm.findByIdAndDelete(req.params.id);
    if (!deletedHabit) {
      return res.status(404).send('Habit not found');
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting habit');
  }
};

// Render the edit habit form with prepopulated data
exports.getEditHabitForm = async (req, res) => {
  try {
    const habit = await HabitForm.findById(req.params.id);
    if (!habit) {
      return res.status(404).send('Habit not found');
    }
    res.render('edit_habit', { habit });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error rendering edit habit form');
  }
};

// Update habit with new data
exports.updateHabit = async (req, res) => {
  const { title, description, days, times } = req.body;
  try {
    const updatedHabit = await HabitForm.findByIdAndUpdate(req.params.id, {
      title,
      description,
      days: Array.isArray(days) ? days : [days],
      times: Array.isArray(times) ? times : [times],
    }, { new: true });
    if (!updatedHabit) {
      return res.status(404).send('Habit not found');
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating habit');
  }
};
