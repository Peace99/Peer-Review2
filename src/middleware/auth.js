const author = require('../models/lecturer');
const reviewer = require('../models/reviewer');
const editor = require('../models/editor');
const roles = require('./constants');
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
      const payload = jwt.verify(token, `${process.env.JWT_SECRET}`);
      console.log("JWT Payload: ", payload)
      const role = payload.role;
      console.log("User Role: ", role)
      if (role !== "author" && role !== "reviewer" && role !== "editor") {
        throw new Unauthenticated("Invalid role");
      }

      let user;

      if (role === "author") {
        user = await author.findOne({ _id: payload.sub });
      } else if (role === "reviewer") {
        user = await reviewer.findOne({ _id: payload.sub });
      } else {
        user = await editor.findOne({ _id: payload.sub });
      }

      if (!user) {
        throw new Unauthenticated("User not found");
      }

      req.user = user;

        // Add the payload data to req.user for further access if needed
        req.user.userId = payload.userId;
        req.user.name = payload.name;
        req.user.role = payload.role;

        next();
    } catch (error) {
        console.log(error);
        throw new Unauthenticated("Authentication invalid");
    }

};

module.exports = auth;
