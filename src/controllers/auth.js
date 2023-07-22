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
              fieldOfResearch,
              department,
              password,
            });
        }
        else {
            newUser = await editor.create({
              title,
              name,
              email,
              password,
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
    const {email, password} = req.body
    let user = null
    const findQuery = { email }
    user = await author.findOne(findQuery)
    let role = "author"
    if (!user) {
        user = await reviewer.findOne(findQuery)
        role = "reviewer"
    }
    else if (!user) {
        user = await editor.findOne(findQuery)
        role = "editor"
    }
    if (!user) {
        throw new BadRequest("Please provide email and password");
    }

    const isPasswordConfirmed = await user.comparePassword(password)
    if (!isPasswordConfirmed){
        throw new Unauthenticated("Invalid Credentials");
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: { name: user.name, email, role, fieldOfResearch: user.fieldOfResearch, id: user.id }, token });
}   catch(error){
    console.log(error)
}

}

module.exports = {signUp, login}