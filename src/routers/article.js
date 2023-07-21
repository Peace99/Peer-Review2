const express = require('express')
const multer = require('multer')
const upload = multer({dest: 'uploads/'})

const router = express.Router()
const {
    getArticle, getAllArticles, submitArticle
} = require('../controllers/article')

router.route('/')
router.post('/submitArticle', upload.single('file'), submitArticle)
router.get('/getAllArticles', getAllArticles)
router.route('/:id').get(getArticle)

module.exports = router