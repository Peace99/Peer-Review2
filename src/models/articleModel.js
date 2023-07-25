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


  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Article", ArticleSchema);
