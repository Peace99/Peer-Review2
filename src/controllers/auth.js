const author = require('../models/lecturer');
const reviewer = require('../models/reviewer');
const editor = require('../models/editor');
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

const getUsersByRole = async (req, res, next) => {
    try {
    const { role } = req.params;
    // Check if the provided role is valid (author, reviewer, or editor)
    if (role !== 'author' && role !== 'reviewer' && role !== 'editor') {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid role. Accepted roles are: author, reviewer, editor' });
    }

    let users;
    if (role === 'author') {
      users = await author.find();
    } else if (role === 'reviewer') {
      users = await reviewer.find();
    } else {
      users = await editor.find();
    }

    if (!users || users.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'No users found for the provided role' });
    }
    // Respond with the users who have the specified role
    res.json({ role, users });
  } catch (error) {
    // Handle any errors that occurred during the database query or processing
    res.status(500).json({ error: 'An error occurred while fetching users by role' });
  }
}

const getUsersById = async (req, res, next) => {
     try {
    const { userId } = req.params; // Assuming the user ID is passed as a parameter in the request

    // Check if the provided user ID is valid
    if (!isValidUserId(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    let user;
    // Determine which model to query based on the user's role
    if (req.user.role === 'author') {
      user = await author.findById(userId);
    } else if (req.user.role === 'reviewer') {
      user = await reviewer.findById(userId);
    } else if (req.user.role === 'editor') {
      user = await editor.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    // Handle any errors that occurred during the database query or processing
    res.status(500).json({ error: 'An error occurred while fetching the user by ID' });
  }
};

// Helper function to validate user ID format (you can customize this based on your ID format)
const isValidUserId = (userId) => {
  // Example: Check if the user ID is a valid MongoDB ObjectId
  const ObjectId = require('mongoose').Types.ObjectId;
  return ObjectId.isValid(userId);
};


const getReviewersByField = async (req, res, next) => {
    try {
      const { fieldOfResearch } = req.params;
      const reviewers = await reviewer.find({ fieldOfResearch });
      if (!reviewers || reviewers.length === 0) {
        return res.status(404).json({message: "No reviewers found for the given field of research",
        });
      }
      // Respond with the reviewers associated with the specified field of research
      res.json({ fieldOfResearch, reviewers });
    } catch (error) {res.status(500).json({error:"An error occurred while fetching reviewers by field of research",
        });
    }
}

module.exports = {signUp, login, getAuthorProfile, getEditorProfile, getReviewerProfile, getReviewersByField, getUsersById, getUsersByRole}