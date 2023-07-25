const express = require('express')
const multer = require('multer')
const upload = multer({dest: 'uploads/'})
const {auth, requireEditor } = require('../middleware/auth')

const router = express.Router()
const {
    getArticle, getAllArticles, submitArticle, assignArticles, declineArticle
} = require('../controllers/article')


router.route('/')
router.post('/submitArticle', upload.single('file'), submitArticle)
router.post('/assign', auth, assignArticles)
router.get('/getAllArticles', getAllArticles)
router.route('/:id').get(auth, getArticle)
router.route('/:id').post(auth, declineArticle)
 
module.exports = router