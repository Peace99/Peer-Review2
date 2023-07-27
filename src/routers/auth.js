const express = require('express');
const router = express.Router();
const {auth, requireEditor} = require('../middleware/auth')


const {
  login,
  signUp,
  getAuthorProfile,
  getReviewerProfile,
  getRoles,
  getReviewersByField,
  getUsersById
} = require("../controllers/auth");

// const {
//   assignedPapers,
// } = require("../controllers/article");
const editor = require('../controllers/auth')

router.post('/signup', signUp)
router.post('/login', login)
router.get('/')
router.get('/authorprofile', auth, getAuthorProfile)
router.get('/reviewerprofile', auth, getReviewerProfile);
router.get('/editorprofile', auth, editor.getEditorProfile)
// router.get("/reviewers/:reviewerId/article", auth, assignedPapers);
router.get("/:roles", auth, getRoles);
router.get("/:fieldOfResearch", auth, requireEditor, getReviewersByField);
router.get("/:id", auth, requireEditor, getUsersById);




module.exports = router