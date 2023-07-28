const nodemailer = require("nodemailer");
require("dotenv").config();
const Articles = require("../models/articleModel");
const Reviewers = require("../models/reviewer");
const Authors = require("../models/lecturer");
const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFoundError } = require("../errors");
const cloudinary = require("../middleware/cloudinary");
const axios = require("axios");
const https = require("https");
const fs = require("fs");

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: true,
//     auth: {
//     user: process.env.EMAIL_ADDRESS,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });


const getAllArticles = async (req, res, next) => {
  try {
    const articles = await Articles.find();
    res.status(StatusCodes.OK).json({ articles });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getArticle = async (req, res) => {
  try {
    const { id: articleId } = req.params;

    // const { userId } = req.user;
    const article = await Articles.findOne({ _id: articleId });
    if (!article) {
      throw new NotFoundError(`No article with id ${articleId}`);
    }
    res.status(StatusCodes.OK).json({ article });
  } catch (error) {
    console.log("the error", error);
  }
};

const getArticlesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const articles = await Articles.find({ userId });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}


// Assuming you have a 'Reviewer' Mongoose model defined
// const reviewersWithMatchingExpertise = await Reviewers.find({ expertise: req.body.fieldOfResearch });
// const selectedReviewers = reviewersWithMatchingExpertise.slice(0, 2);

const assign = async (req, res) => {
  try { 
    const articleId = req.params.articleId;
    const reviewerIds = req.body.reviewerIds;
    await Articles.updateOne(
      { _id: articleId },
      { $set: { status: "in-review" } }
    );
    const article = await Articles.findById(articleId);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Find the reviewers by their IDs (This part may be handled in a separate endpoint or middleware)
    const reviewers = await Reviewers.find({ _id: { $in: reviewerIds } });

    if (reviewers.length !== reviewerIds.length) {
      return res
        .status(404)
        .json({ message: "One or more reviewers not found" });
    }
    article.assignedReviewers = reviewerIds;
    await article.save();

    // for (const reviewerId of reviewerIds) {
    //   const reviewer = await Reviewers.findById(reviewerId);
    //   if (reviewer) {
    //     reviewer.papersAssigned.push(article._id);
    //     await reviewer.save();
    //   }
    // }
    res.json({ message: "Reviewers assigned successfully" });
  } catch (err) {
    console.error("Error assigning reviewers:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

const declineArticle = async (req, res) => {
  try {
    const { id: articleId } = req.params;

    await Articles.updateOne(
      { _id: articleId },
      { $set: { status: "rejected" } }
    );
    const article = await Articles.findOne({ _id: articleId });

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    const author = await Authors.findOne({ _id: article.userId });
    if (!author) {
      return res.status(500).json({ error: "Author not found" });
    }
res.json({ message: "Paper rejected and email sent to the author" });
  } catch (err) {
    console.error("Error in rejecting the paper:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

//get papers assigned to reviewers
// const assignedPapers = async (req, res) => {
//   try {
//     const reviewerId = req.params.reviewerId;

//     // Find the reviewer by their ID
//     const reviewer = await Reviewer.findById(reviewerId);

//     if (!reviewer) {
//       return res.status(404).json({ message: "Reviewer not found" });
//     }

//     // Find the papers assigned to the reviewer
//     const assignedPaperIds = reviewer.papersAssigned;
//     const assignedPapers = await Articles.find({ _id: { $in: assignedPaperIds } });

//     res.json({ assignedPapers });
//   } catch (err) {
//     console.error("Error fetching papers assigned to reviewer:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }

const submitArticle = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { typeOfReview, title, abstract, fieldOfResearch, keywords, url } =
      req.body;
    let fileUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      fileUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }
    const article = await Articles.create({
      typeOfReview,
      userId,
      title,
      abstract,
      fieldOfResearch,
      keywords,
      url,
      fileUrl,
    });
    res.status(StatusCodes.OK).json({ article });
  } catch (err) {
    console.log(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const articleStatus = async (req, res) => {
  try {
    const { status } = req.query; 
    // Get the 'status' query parameter

    // Check if the 'status' query parameter is provided
    // If provided, filter articles based on the 'status'; otherwise, retrieve all articles
    const query = status ? { status } : {};

    // Fetch articles based on the provided 'status' query parameter
    const articles = await Articles.find(query);

    res.status(StatusCodes.OK).json({ articles });
  } catch (err) {
    console.log(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const articleStatusCount = async (req, res) => {
 const { status } = req.query; // Get the 'status' query parameter
 try {
    if (!status) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Status parameter is required" });
    }

    // Check if the provided status is valid
    const validStatusValues = ["rejected", "in-review", "pending", "accepted"];
    if (!validStatusValues.includes(status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid status value" });
    }

    // Fetch the count of articles with the provided status
    const query = { status };
    const count = await Articles.countDocuments(query);

    res.status(StatusCodes.OK).json({ statusCount: count });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
}

const articleStatusCountById = async (req, res) => {
  try {
    const { userId, status } = req.query; 

    if (!userId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "userId parameter is required" });
    }

    const query = {};
    if (userId) {
      query.userId = userId;
    }
    if (status) {
      query.status = status;
    }

    const count = await Articles.countDocuments(query);

    res.status(StatusCodes.OK).json({ count });
  } catch (err) {
    console.log(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};







module.exports = {getAllArticles, getArticle, submitArticle, articleStatus, assign,
   declineArticle, articleStatusCount, articleStatusCountById, getArticlesByUserId
};
