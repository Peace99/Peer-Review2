const express = require('express');
const router = express.Router();

const { login, signUp, getAuthorProfile, getEditorProfile, getReviewerProfile, getReviewersByField, getUsersById, getUsersByRole } = require("../controllers/auth");

router.post('/signup', signUp)
router.post('/login', login)
router.get('/')
router.get('/author/profile', getAuthorProfile)
router.get('/reviewer/profile', getReviewerProfile);
router.get('/editor/profile', getEditorProfile)
router.get('/reviewers/:fieldOfResearch', getReviewersByField);
router.get('/:id', getUsersById)
router.get('/getUser', getUsersByRole)

module.exports = router