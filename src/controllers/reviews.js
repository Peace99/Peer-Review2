const axios = require("axios");
const Review = require("../models/reviewModel"); 
const Article = require("../models/articleModel");
const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFoundError } = require("../errors");

const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ createdBy: req.user.id }); // Rename to avoid conflict
    res.status(StatusCodes.OK).json({ reviews });
  } catch (err) {
    next(err);
  }
};

const getReview = async (req, res, next) => {
  try {
    const {
      user: { userId },
      params: { id: reviewId },
    } = req;
    const review = await Review.findOne({ id: reviewId, createdBy: userId });
    if (!review) {
      throw new NotFoundError(`No review with id ${reviewId}`);
    }
    res.status(StatusCodes.OK).json({ review });
  } catch (err) {
    next(err);
  }
};

const getPendingReviews = async (req, res, next) => {
  try {
    const articles = await Article.find({ review: null }).exec();
    res.status(StatusCodes.OK).json(articles);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to fetch articles with no review" });
  }
};

const getReviewedArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({ review: { $ne: null } }).exec();
    res.status(StatusCodes.OK).json(articles);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to fetch reviewed articles" });
  }
};

const submitReviews = async (req, res, next) => {
  try {
    const reviewerResponses = req.body;
    const review = new Review(reviewerResponses); // Rename to avoid conflict
    await review.save();

    res
      .status(StatusCodes.CREATED)
      .json({ message: "Review saved successfully." });
  } catch (err) {
    next(new BadRequest("Error saving the review."));
  }
};

const reviewerResponses = {
  // ... reviewerResponses object with all the answers
};

axios
  .post("/submitReview", reviewerResponses)
  .then((response) => {
    console.log(response.data.message); // Review saved successfully.
  })
  .catch((error) => {
    console.error(error);
  });

module.exports = {
  getAllReviews,
  getReview,
  getPendingReviews,
  getReviewedArticles,
  submitReviews,
};
