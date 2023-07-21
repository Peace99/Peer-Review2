const express = require("express");

const router = express.Router();
const {
  getReviews,
  getAllReviews,
  submitReviews,
} = require("../controllers/reviews");

router.route("/").post(submitReviews);
router.get(getAllReviews);
router.route("/:id").get(getReviews);

module.exports = router;
