const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;


// Connect to MongoDB
mongoose.connect(uri);


// Handle MongoDB connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Handle successful MongoDB connection
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB successfully');
});

// Export mongoose object
module.exports = mongoose;








