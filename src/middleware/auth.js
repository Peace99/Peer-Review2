const User = require('../models/userModel');
const jwt = require("jsonwebtoken")
const Unauthenticated  = require('../errors/unauthorized')
require("dotenv").config();

const auth = async(req, res, next) => {
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
        const user = User.findById(payload.id).select("password")
    req.user = user
    
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    console.log(error);
    throw new Unauthenticated("Authentication invalid");
  }
};

module.exports = auth;
