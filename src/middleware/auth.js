const User = require('../models/userModel');
const jwt = require("jsonwebtoken")
const Unauthenticated  = require('../errors/unauthorized')
require("dotenv").config();

const auth = async(req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        throw new Unauthenticated("Invalid")
    }
    const token = authHeader.split(":")[1]

    try {
        const payload = jwt.verify(token, `${process.env.JWT_SECRET}`)
        const user = User.findById(payload.id).select("password")
    req.user = user
    
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    throw new Unauthenticated("Authentication invalid");
  }
};

module.exports = auth;
