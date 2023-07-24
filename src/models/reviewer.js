const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Schema = require('mongoose')

const reviewerSchema = mongoose.Schema({
  _id: Schema.Types.ObjectId,
  title: String,
  email: String, 
  name: String,
  password: String,
  department: String,
  role: String,
  fieldOfResearch: String,
});

reviewerSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

reviewerSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name, role: this.role},
    `${process.env.JWT_SECRET}`,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

reviewerSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("Reviewer", reviewerSchema);
