const mongoose = require('mongoose');
// const Schema = require('mongoose')

const userSchema = mongoose.Schema({
  title: String,
  email: String, // String is shorthand for {type: String}
  name: String,
  password: String,
  department: String,
  fieldOfResearch: String,
});

module.exports = mongoose.model('Users', userSchema);