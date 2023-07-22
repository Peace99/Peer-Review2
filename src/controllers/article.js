const Articles = require('../models/articleModel')
const { StatusCodes } = require('http-status-codes')
const { BadRequest, NotFoundError } = require("../errors");

// const cloudinary = require('../middleware/cloudinary')

const getAllArticles = async (req, res, next) => {
    try{
    const articles = await Articles.find()
    res.status(StatusCodes.OK).json({articles})
    } catch(err){
        console.log(err)
        next(err)
    }
}

const getArticle = async (req, res) => {
    try {
    const { id:articleId} = req.params
    const { userId } = req.user
    const article = await Articles.findOne({_id: articleId, userId})
    if (!article){
        throw new NotFoundError(`No article with id ${articleId}`);
    }
    res.status(StatusCodes.OK).json({article})
} catch (err) {
    console.log(err);
}
}

const submitArticle = async (req, res) => {
    try{
    const userId = req.user.userId
    const {typeOfReview, title, abstract, fieldOfResearch, keywords, url} = req.body
    let fileUrl = '';
    if (req.file){
        // const result = await cloudinary.uploader.upload(req.file.path);
        fileUrl = req.file.path;

        // const fs = require('fs')
        // fs.unlinkSync(req.file.path)
    }
    const article = await Articles.create({
       typeOfReview,
        userId,
        title,
        abstract,
        fieldOfResearch,
        keywords, 
        url,
        fileUrl
    })
    res.status(StatusCodes.OK).json({ article})
}
    catch(err) {
    console.log(err)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" })
}
}

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
}

module.exports = { getAllArticles, getArticle, submitArticle, articleStatus}