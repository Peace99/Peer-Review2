const author = require('../models/lecturer');
const reviewer = require('../models/reviewer');
const editor = require('../models/editor');
const helper = require('../helpers/helper')
const { StatusCodes } = require("http-status-codes");
const { BadRequest } = require("../errors");
const Unauthenticated = require('../errors/unauthorized')


const signUp = async (req, res, next) => {
    // const user = await User.create({...req.body})
    // const token = user.createJWT()
    try {
        const {title, name, email, role, password, fieldOfResearch, department} = req.body
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
                role,
                fieldOfResearch,
                department,
                password
            })
        }
        else if (role === "reviewer"){
            newUser = await reviewer.create({
              title,
              name,
              email,
              role,
              fieldOfResearch,
              department,
              password
            });
        }
        else {
            newUser = await editor.create({
              title,
              name,
              email,
              role,
              password
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
        console.log(password);
        //const hashedPassword = await bcrypt.hash(password, 10);
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
        // console.log("Password from login:", password);
        // console.log("Hashed password from the database:", user.password);
        // console.log("Password match result:", passwordMatch);
        if (!user) {
            throw new Unauthenticated("Invalid Credentials");
        }

        const token = user.createJWT();
        res.status(StatusCodes.OK).json({
            user: { name: user.name, email, role, fieldOfResearch: user.fieldOfResearch, id: user.id },
            token
        });
    } catch (error) {
        console.log("Error during login:", error);
    }
};


const getAuthorProfile = async (req, res, next) => {
      try {
      const authorProfile = await author.findOne({ _id: req.user.userId });

      if (!authorProfile) {
        return res.status(404).json({ error: "Author profile not found" });
      }
      res.json(authorProfile);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching the author profile" });
    }
  ;
}

const getReviewerProfile = async (req, res, next) => {
  try {
    const reviewerProfile = await reviewer.findOne({ _id: req.user.userId });

    if (!reviewerProfile) {
      return res.status(404).json({ error: "Author profile not found" });
    }
    res.json(reviewerProfile);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the author profile" });
  }
};

const getEditorProfile = async (req, res,) => {
    try {
      const editorProfile = await editor.findOne({ _id: req.user.userId });
      if (!editorProfile) {
        return res.status(404).json({ error: "Editor profile not found" });
      }
      res.json(editorProfile);
    } catch (error) {
      res .status(500).json({ error: "An error occurred while fetching the editor profile" });
    }
}


const getRoles = async (req, res, next) => {
  try {
    const  role  = req.params.role;
    console.log(role)

    if (!role || (role !== "author" && role !== "reviewer")) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Invalid role. Accepted roles are: author, reviewer",
      });
    }

    const { editorRole } = req.user;
    console.log(editorRole);
    if (editorRole !== "editor") {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Only editors can access this endpoint" });
    }

    let users;
    if (role === "author") {
      users = await author.find();
    } else if (role === "reviewer") {
      users = await reviewer.find();
    }

    if (!users || users.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No users found for the provided role" });
    }
    res.json({ role, users });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching users by role" });
  }
};

const isValidUserId = (userId) => {
  const userIdRegex = /^[0-9a-fA-F]{24}$/;
  // const ObjectId = require('mongoose').Types.ObjectId;
  return userIdRegex.test(userId);
  // ObjectId.isValid(userId);
};


const getReviewersByField = async (req, res, next) => {
  try {
    const { fieldOfResearch } = req.params;
    const reviewers = await reviewer.find({ fieldOfResearch });
    if (!reviewers) {
      return res
        .status(404)
        .json({ message: "No reviewers found for the given field " });
    }
    // Respond with the reviewers associated with the specified field of research
    res.json({ fieldOfResearch, reviewers });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        error:
          "An error occurred while fetching reviewers by field of research",
      });
  }
};

const getUsersById = async (req, res, next) => {
     try {
       const userId = req.params.id;
       if (!isValidUserId(userId)) {
         return res.status(400).json({ error: "Invalid user ID format" });
       }
       // Helper function to validate user ID format (you can customize this based on your ID format)
       let user = await helper(userId);
       if (!user) {
         return res.status(404).json({ message: "User not found" });
       }

       res.json(user);
     } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred while fetching the user by ID' });
  }
};












module.exports = {signUp, login, getAuthorProfile, getEditorProfile, getReviewerProfile, getRoles, getUsersById, getReviewersByField }