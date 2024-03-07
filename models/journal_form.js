const mongoose = require('mongoose');

const journalFormSchema = new mongoose.Schema({
  title: String,
  date: String,
  time: String,
  entry: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const JournalForm = mongoose.model('JournalForm', journalFormSchema);

module.exports = JournalForm;
