const Articles = require('../models/articleModel')
import { StatusCodes } from 'http-status-codes'

const getAllArticles = async (req, res, next) => {
    const articles = await Articles.find({createdBy: req.user.user.id})
    res.status(StatusCodes.OK).json({articles})
}

const getArticle = async (req, res) => {
    const {user: {userId},params: {id:articleId} } = req.params
    const article = await Articles.findOne({id: articleId, createdBy: userId})
    if (!article){

    }
    res.status(StatusCodes.OK).json({article})
}

const createArticle = async (req, res) => {
    req.body.createdBy = req.user.userId
    const {typeOfReview, title, abstract, keywords} = req.body
    const article = await submitArticle({
        authorId: userId,
        title,
        abstract,
        keywords, 
        url: removeSpaces(req?.file?.originalname),
    })
    res.status(StatusCodes.CREATED).json({ article})
}

module.exports = { getAllArticles, getArticle, createArticle}