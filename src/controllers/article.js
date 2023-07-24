var SibApiV3Sdk = require("sib-api-v3-sdk");
const Articles = require("../models/articleModel");
const Reviewers = require("../models/reviewer");
const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFoundError } = require("../errors");
const cloudinary = require("../middleware/cloudinary");
SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
  "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";


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
    const { userId } = req.user;
    const article = await Articles.findOne({ _id: articleId, userId });
    if (!article) {
      throw new NotFoundError(`No article with id ${articleId}`);
    }
    res.status(StatusCodes.OK).json({ article });
  } catch (err) {
    console.log(err);
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

      const fs = require("fs");
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
    const { status } = req.query; // Get the 'status' query parameter

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

const assignArticles = async (req, res) => {
  try {
    const { articleId, reviewers } = req.body;
    const article = await Articles.findOne({ articleId: articleId });
    console.log(articleId);
    if (!article) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "article not found" });
    }
    const reviewerList = await Reviewers.find({ _id: { $in: reviewers } });
    const reviewersEmail = reviewerList.map((reviewer) => reviewer.email);

    await Articles.updateOne(
      { _id: article._id },
      { $set: { reviewers: reviewersEmail } }
    );

    await sendEmails(reviewersEmail, article);
    res.json({ message: "Reviewers assigned and emails sent successfully" });
  } catch (err) {
    console.error("Error in assigning reviewers and sending emails:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }

  async function sendEmails(emails, article) {
    const sendinblueClient = new SibApiV3Sdk.TransactionalEmailsApi()

      const emailData = {
      to: emails.map((email) => ({ email })),
      from: { email: "mhizeirene@gmail.com", name: "Revisar" }, // Replace with your email address and name
      subject: "Review Request for Paper",
      html: `<p>Dear Reviewer,</p><p>You are invited to review the paper titled "${article.title}". Please find the paper attached.</p><p>Regards,</p><p>Editor</p>`,
      attachment: [
        {
          name: "Peer Review", // Replace with the actual filename of the paper
          content: "Base64_encoded_paper_content", // Replace with the Base64-encoded content of the paper
        },
      ],
    };

  try {
    const response = await sendinblueClient.send_email(emailData);
    console.log("Sendinblue API response:", response);
  } catch (error) {
    console.error("Error sending email via Sendinblue:", error);
  }

}
}

module.exports = { getAllArticles, getArticle, submitArticle, articleStatus};
