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

    // review: {
    //   type: ReviewSchema,
    //   default: null,
    // },
  },
  {
    timestamps: true,
  }
);



/** Article model to be used for interacting with our collection. Refer to mongoose docs for the difference between a schema {@link https://mongoosejs.com/docs/guide.html} and a model {@link https://mongoosejs.com/docs/models.html} */
module.exports = mongoose.model("Article", ArticleSchema);
