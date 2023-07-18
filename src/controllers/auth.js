const User = require('../models/userModel');
const { StatusCodes } = require("http-status-codes");
const { BadRequest } = require("../errors");
const Unauthenticated = require('../errors/unauthorized')

const signUp = async (req, res, next) => {
    const user = await User.create({...req.body})
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user:{name:user.name}, token:token})
}

const login = async (req, res, next) => {
    const {email, password} = req.body
    if (!email || !password) {
        throw new BadRequest("Please provide email and password");
    }

    const user = await User.findOne({ email: email})
    if (!user) {
        throw new Unauthenticated("Invalid Credentials");
    }

    const isPasswordConfirmed = await user.comparePassword(password)
    if (!user){
        throw new Unauthenticated("Invalid Credentials");
    }

    return res.status(StatusCodes.OK).json({
        accessToken: generateJwt(user, role),
        email,
        role,
        fieldOfResearch,
        name: user.name,
        id: user.id
    })

}

module.exports = {signUp, login}