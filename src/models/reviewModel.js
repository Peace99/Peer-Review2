import mongoose, {Schema} from "mongoose";

const reviewSchema = mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Reviewer",
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
});


export const reviewModel = mongoose.model('Review', reviewSchema)