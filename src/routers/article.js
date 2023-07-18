const express = require('express')

const router = express.Router()
const {
    getArticle, getAllArticles, createArticle
} = require('../controllers/article')

router.route('/').post(createArticle)
router.get(getAllArticles)
router.route('/:id').get(getArticle)

module.exports = router