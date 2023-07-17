const express = require('express')

const router = express.Router()
const {
    getArticle, getAllArticles, createArticles
} = require('../controllers/article')

router.route('/').post(createArticles)
router.get(getAllArticles)
router.route('/:id').get(getArticle)

module.exports = router