const mongoose = require('mongoose');
const Schema = require('mongoose')

const reviewSchema = mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Reviewer",
  },

  articleId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Article",
  },

  question1: {
    type: String,
    required: true,
  },

  question2: {
    type: String,
    required: true,
  },

  question3: {
    type: String,
    required: true,
  },

  question4: {
    type: String,
    required: true,
  },

  recommendation: {
    type: String,
    required: true,
  },

  comment: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "reviewed"],
    required: true,
  },
});


 module.exports = mongoose.model('Review', reviewSchema)