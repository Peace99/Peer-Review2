const Articles = require('../models/articleModel')
const { StatusCodes } = require('http-status-codes')
const { BadRequest, NotFoundError } = require("../errors");
// const multer = require('multer');
const cloudinary = require('../middleware/cloudinary')

const getAllArticles = async (req, res, next) => {
    try{
    const articles = await Articles.find({userId: req.user.user.id})
    res.status(StatusCodes.OK).json({articles})
    } catch(err){
        console.log(err)
        next(err)
    }
}

const getArticle = async (req, res) => {
    try {
    const {user: {userId}, params: {id:articleId} } = req.params
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
        const result = await cloudinary.uploader.upload(req.file.path);
        fileUrl = result.secure_url

        const fs = require('fs')
        fs.unlinkSync(req.file.path)
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

module.exports = { getAllArticles, getArticle, submitArticle}