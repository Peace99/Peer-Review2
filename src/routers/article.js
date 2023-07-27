const express = require('express')
const multer = require('multer')
const upload = multer({dest: 'uploads/'})
const {auth, requireEditor } = require('../middleware/auth')

const router = express.Router()
const {
    getArticle, getAllArticles, getArticlesByUserId, submitArticle, assign, declineArticle, articleStatus, articleStatusCount, assignedPapers} = require('../controllers/article')


router.route('/')
router.post('/submitArticle', upload.single('file'), submitArticle)
router.get('/getAllArticles', getAllArticles) 
router.get('/status', auth, articleStatus)
router.get('/count', auth, articleStatusCount)
router.get('/')
router.get('/:userId', auth, getArticlesByUserId)
router.route('/:id').get(auth, getArticle)
router.post("/:articleId/assign-reviewers", auth, assign);
router.get('/reviewers/:reviewerId/article', auth, assignedPapers)
router.route('/:id').post(auth, declineArticle)

 
module.exports = router