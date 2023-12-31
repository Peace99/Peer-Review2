const mongoose = require('mongoose')

connectDB = async url => {
    mongoose
    .connect(url)
    .then(() => console.log("connection established"))
    .catch(err => console.log("connection error"))
}

module.exports = connectDB