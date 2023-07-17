const express = require('express');
const router = express.Router();

const { login, signUp } = require("../controllers/auth");

router.post('/signup', signUp)
router.post('/login', login)