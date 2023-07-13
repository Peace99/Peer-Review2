import { express } from "express";

const router = express.Router()
const {
    getArticle, getAllArticles, createArticles
} = require()

router.route('/').post(createArticles).get(getAllArticles)
router.route('/:id').get(getArticle)

module.exports = router