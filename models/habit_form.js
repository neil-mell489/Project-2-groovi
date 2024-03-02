const mongoose = require('mongoose');

const habitFormSchema = new mongoose.Schema({
  title: String,
  description: String,
  days: [String],
  times: [String],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const HabitForm = mongoose.model('HabitForm', habitFormSchema);

module.exports = HabitForm;
