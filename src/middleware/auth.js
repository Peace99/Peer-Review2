const author = require('../models/lecturer');
const reviewer = require('../models/reviewer');
const editor = require('../models/editor');
const roles = require('./constants');
const jwt = require("jsonwebtoken")
const Unauthenticated  = require('../errors/unauthorized')
require("dotenv").config();

const auth = async(req, res, done, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        throw new Unauthenticated("Invalid")
    }
    console.log(authHeader)
    const token = authHeader.split(" ")[1]
    console.log(token)
    try {
        const payload = jwt.verify(token, `${process.env.JWT_SECRET}`)
        console.log(payload)
        roles = payload.role;
        if (!roles.includes(roles)) {
          return done("Invalid role")
        }
        if (roles === "author"){
        await author.findOne({ _id: payload.sub})
        req.user = author
        return done(null, author)
        }
        else if(roles === "reviewer") {
         await reviewer.findOne({ _id: payload.sub})
         req.user = reviewer
         return done(null, reviewer)
        }
        else {
          await editor.findOne({ _id: payload.sub})
          req.user = editor
          return done(null, editor)
        }
    //     const user = User.findById(payload.id).select("password")
    // req.user = user
    
    // req.user = { userId: payload.userId, name: payload.name };
    // next();
  } catch (error) {
    console.log(error);
    throw new Unauthenticated("Authentication invalid");
  }
};

module.exports = auth;
