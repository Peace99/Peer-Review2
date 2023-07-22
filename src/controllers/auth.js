const author = require('../models/lecturer');
const reviewer = require('../models/reviewer');
const editor = require('../models/editor');
const bcrypt = require("bcrypt")
const { StatusCodes } = require("http-status-codes");
const { BadRequest } = require("../errors");
const Unauthenticated = require('../errors/unauthorized')

async function hash(rawString) {
  return bcrypt.hash(rawString, 10);
}

async function compare(rawString, hash) {
  return bcrypt.compare(rawString, hash);
}

const signUp = async (req, res, next) => {
    // const user = await User.create({...req.body})
    // const token = user.createJWT()
    try {
        const {title, name, email, role, password, fieldOfResearch, department} = req.body
        const hashedPassword = await hash(password);
        const authorExists = await author.exists({ email });
        const reviewerExists = await reviewer.exists({ email });
        const editorExists = await editor.exists({ email });
        if (!authorExists || !reviewerExists) {
            res.status(StatusCodes.UNAUTHORIZED)
        }
        else if (!editorExists) {
            res.status(StatusCodes.UNAUTHORIZED);
        }
        let newUser = null;
        if (role === "author"){
            newUser = await author.create({
                title, 
                name,
                email,
                fieldOfResearch,
                department,
                password: hashedPassword
            })
        }
        else if (role === "reviewer"){
            newUser = await reviewer.create({
              title,
              name,
              email,
              fieldOfResearch,
              department,
              password: hashedPassword,
            });
        }
        else {
            newUser = await editor.create({
              title,
              name,
              email,
              password: hashedPassword,
            });
        }
        await newUser.save();
        return res.status(StatusCodes.CREATED).json(newUser)
    }

    catch (error) {}
    res.status(StatusCodes.OK).json({user:{name:user.name}, token:token})
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log("Received login request for email:", email);
        let user = null;
        const findQuery = { email };

        // Try to find the user as an author
        user = await author.findOne(findQuery);
        let role = "author";

        // If not found as an author, try to find the user as a reviewer
        if (!user) {
            user = await reviewer.findOne(findQuery);
            role = "reviewer";
        }

        // If not found as a reviewer, try to find the user as an editor
        if (!user) {
            user = await editor.findOne(findQuery);
            role = "editor";
        }
        console.log("User found in the database:", user);

        if (!user) {
            throw new BadRequest("Please provide email and password");
        }

        const passwordMatch = await user.comparePassword(password);

        if (!passwordMatch) {
            throw new Unauthenticated("Invalid Credentials");
        }
        console.log("Password confirmed:", isPasswordConfirmed);

        const token = user.createJWT();
        console.log("Generated JWT token:", token);
        res.status(StatusCodes.OK).json({
            user: { name: user.name, email, fieldOfResearch: user.fieldOfResearch, id: user.id },
            token
        });
    } catch (error) {
        console.log("Error during login:", error);
    }
};


module.exports = {signUp, login}