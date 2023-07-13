const User = require('../models/userModel');

const signUp = async (req, res, next) => {
    const user = await User.create({...req.body})
    const token = user.createJWT()
    res.status(200).send.json({user:{name:user.name}, token:token})
}

const login = async (req, res, next) => {
    const {email, password} = req.body
    if (!email || !password) {

    }

    const user = await User.findOne({ email: email})
    if (!user) {

    }

    const isPasswordConfirmed = await user.comparePassword(password)
    if (!user){

    }

    return res.status(200).json({
        accessToken: generateJwt(user, role),
        email,
        role,
        fieldOfResearch,
        name: user.name,
        id: user.id
    })

}

module.exports = {signUp, login}