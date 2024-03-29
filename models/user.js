// models/user.js
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// Plugin Passport-Local-Mongoose
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
