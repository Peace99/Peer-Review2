const express = require("express");
const { auth, requireEditor } = require('../middleware/auth')

const router = express.Router();
const {
  getReview,
  getAllReviews,
  submitReviews, getPendingReviews, getReviewedArticles
} = require("../controllers/reviews");

router.get("/pending-reviews", auth, getPendingReviews);
router.get("/reviewed-articles", auth, getReviewedArticles);
router.post("/submitReview", auth, submitReviews);
router.get("/reviews", auth, getAllReviews);
router.get("/:id", auth, getReview);


// router.route("/").post(submitReviews);
// router.get(getAllReviews);
// router.route("/:id").get(getReview);

module.exports = router;
