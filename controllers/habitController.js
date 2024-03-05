// habitController.js

const HabitForm = require('../models/habit_form');

// Render the homepage with the logged-in user's habits
exports.getHomepage = async (req, res) => {
  try {
    // Fetch only the habits associated with the logged-in user
    const habits = await HabitForm.find({ user: req.user._id });
    // Log the habits array to inspect its contents
    console.log(habits);
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
  const { title, description } = req.body;
  const days = [];
  const times = [];

  // Loop through each day of the week and check if the checkbox is checked
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (const day of daysOfWeek) {
    const checked = req.body[`check${day}`] === 'on'; // Check if the checkbox is checked
    if (checked) {
      days.push(day);
      times.push(req.body[`time${day}`]); // Get the corresponding time input value
    }
  }

  try {
    // Associate the habit with the logged-in user
    const habit = new HabitForm({
      title,
      description,
      days,
      times,
      user: req.user._id  // Associate with the logged-in user
    });
    await habit.save();  // Save the habit to the database
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
  const { title, description } = req.body;
  const updatedDays = [];
  const updatedTimes = [];

  // Loop through each day of the week and check if the checkbox is checked
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (const day of daysOfWeek) {
    const checked = req.body[`check${day}`] === 'on'; // Check if the checkbox is checked
    if (checked) {
      updatedDays.push(day);
      updatedTimes.push(req.body[`time${day}`]); // Get the corresponding time input value
    }
  }

  try {
    const habit = await HabitForm.findById(req.params.id);
    if (!habit) {
      return res.status(404).send('Habit not found');
    }

    // Update habit properties
    habit.title = title;
    habit.description = description;
    habit.days = updatedDays;
    habit.times = updatedTimes;

    await habit.save(); // Save the updated habit to the database

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating habit');
  }
};
