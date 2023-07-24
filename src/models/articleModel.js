const mongoose = require('mongoose');
const Schema = require('mongoose');
// const ReviewSchema = require('../models/reviewModel')

const ReviewSchema = new mongoose.Schema({
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
    default: "pending",
  },
});
/** Article schema defined with validation rules */
const ArticleSchema = mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Author",
    },

    fileUrl: {
      type: String,
      default: null,
    },

    title: {
      type: String,
      required: true,
    },

    abstract: {
      type: String,
      required: true,
    },

    fieldOfResearch: {
      type: String,
      required: true,
    },

    keywords: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "in-review", "assigned", "accepted", "rejected"],
      default: "pending",
      required: true,
    },

    review: {
      type: ReviewSchema,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/** Article model to be used for interacting with our collection. Refer to mongoose docs for the difference between a schema {@link https://mongoosejs.com/docs/guide.html} and a model {@link https://mongoosejs.com/docs/models.html} */
module.exports = mongoose.model("Article", ArticleSchema);
