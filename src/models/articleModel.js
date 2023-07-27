const mongoose = require('mongoose');
const Schema = require('mongoose');
const ReviewSchema = require('../models/reviewModel')


/** Article schema defined with validation rules */
const ArticleSchema = mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Author",
    },

    // reviewType: {
    //   type: String,
    //   enum: ["double-blind", "single-blind"],
    //   required: true,
    // },

    journalType: {
      type: String,
      enum: [
        "Science",
        "Medicine",
        "Finance",
        "Agriculture",
        "Art",
        "Education",
      ],
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
    fileUrl: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "in-review",
        "reviewed",
        "assigned",
        "accepted",
        "rejected",
      ],
      default: "pending",
      required: true,
    },

    assignedReviewers: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      ref: "Reviewer",
    },

    review: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Review",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Article", ArticleSchema);
