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

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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
    if (!author || !author.email) {
      return res.status(500).json({ error: "Author email not found" });
    }

    const emailData = {
      to:  author.email ,
      from: { email: "mhizeirene@gmail.com", name: "Revisar" },
      subject: "Paper Rejection Notification",
      html: `<p>Dear ${author.name},</p><p>We regret to inform you that your paper titled "${article.title}" has been rejected for publication.</p><p>Regards,</p><p>Editor</p>`,
    };

    const info = await transporter.sendMail(emailData);

    console.log("Sendinblue API response:", info);

    res.json({ message: "Paper rejected and email sent to the author" });
  } catch (err) {
    console.error("Error in rejecting the paper:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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



const assignArticles = async (req, res) => {
  try {
    const { articleId, reviewers } = req.body;
    await Articles.updateOne(
      { _id: articleId },
      { $set: { status: "in-review" } }
    );
    const article = await Articles.findOne({ _id: articleId });
    console.log(articleId);
    if (!article) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "article not found" });
    }
    const reviewerList = await Reviewers.find({
      email: { $in: reviewers.email },
    });
    const reviewersEmail = reviewerList.map((reviewer) => reviewer.email);

    await Articles.updateOne(
      { _id: article._id },
      { $set: { reviewers: reviewersEmail } }
    );
    for (const reviewerEmail of reviewersEmail) {
    await sendEmail(article._id, reviewerEmail);
    }
  }
  catch (err){
    console.error(err);
  }
}

async function sendEmail(article, reviewerEmail) {
  try {
    const articlePath = await fetchArticlePathFromDatabase(article._Id); 

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: reviewerEmail,
      subject: 'Article Review Request',
      text: `Dear Reviewer,\n\nWe would like to request you to review our article titled "${article.title}".\n\nPlease find the article attached.\n\nBest regards,\nThe Review Team`,
      attachments: [
        {
          filename: `${article.title}`, 
          path: `${article.fileUrl}`, 
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
async function fetchArticlePathFromDatabase(articleId){
    try {
        const article = await Articles.findOne({id: articleId})
        return article
    } catch (error) {
        console.log(error)
    }
}




module.exports = {getAllArticles, getArticle, submitArticle, articleStatus, assignArticles,
   declineArticle, articleStatusCount, articleStatusCountById, getArticlesByUserId
};
