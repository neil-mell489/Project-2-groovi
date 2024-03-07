// journalController.js

const JournalForm = require('../models/journal_form');

// Render the journal page with the logged-in user's journal entries
exports.getJournalPage = async (req, res) => {
  try {
    // Fetch only the journal entries associated with the logged-in user
    const journalEntries = await JournalForm.find({ user: req.user._id });
    
    // Log the journalEntries array to inspect its contents
    console.log(journalEntries);
    
    // Pass the user's name and journal entries to the template
    res.render('journal', { journalEntries, userName: req.user.username });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching journal entries');
  }
};

// Render the form for creating a new journal entry
exports.getNewJournalForm = (req, res) => {
  // Get current date in YYYY-MM-DD format
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Get current time in HH:MM format
  const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  
  // Render the new journal entry form and pass currentDate and currentTime as variables
  res.render('new_journal', { currentDate, currentTime });
};

// Submit a new journal entry
exports.submitJournalForm = async (req, res) => {
  const { title, date, time, entry } = req.body;

  try {
    // Associate the journal entry with the logged-in user
    const journalEntry = new JournalForm({
      title,
      date,
      time,
      entry,
      user: req.user._id  // Associate with the logged-in user
    });
    
    // Save the journal entry to the database
    await journalEntry.save();  

    // Redirect to the journal page
    res.redirect('/journal');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating new journal entry');
  }
};

// Delete a journal entry
exports.deleteJournalEntry = async (req, res) => {
  try {
    const deletedEntry = await JournalForm.findByIdAndDelete(req.params.id);
    if (!deletedEntry) {
      return res.status(404).send('Journal entry not found');
    }
    res.redirect('/journal'); // Redirect to the journal page
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting journal entry');
  }
};

// Render the edit journal entry form with prepopulated data
exports.getEditJournalForm = async (req, res) => {
  try {
    const journalEntry = await JournalForm.findById(req.params.id);
    if (!journalEntry) {
      return res.status(404).send('Journal entry not found');
    }
    res.render('edit_journal', { journalEntry });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error rendering edit journal entry form');
  }
};

// Update journal entry with new data
exports.updateJournalEntry = async (req, res) => {
  const { title, date, time, entry } = req.body;

  try {
    const journalEntry = await JournalForm.findById(req.params.id);
    if (!journalEntry) {
      return res.status(404).send('Journal entry not found');
    }

    // Update journal entry properties
    journalEntry.title = title;
    journalEntry.date = date;
    journalEntry.time = time;
    journalEntry.entry = entry;

    // Save the updated journal entry to the database
    await journalEntry.save(); 

    // Redirect to the journal page
    res.redirect('/journal');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating journal entry');
  }
};

// Render a single journal entry on the journal_show page
exports.getJournalEntry = async (req, res) => {
    try {
      const journalEntry = await JournalForm.findById(req.params.id);
      if (!journalEntry) {
        return res.status(404).send('Journal entry not found');
      }
      res.render('journal_show', { journalEntry });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error rendering journal entry');
    }
  };

module.exports = exports;
