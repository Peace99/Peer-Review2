const author = require("../models/lecturer");
const reviewer = require("../models/reviewer");

const searchUser = async (id) => {
    let user 
    user = await reviewer.findById(id)
    if (user) {
        return user
    }
    else {
        user = await author.findById(id)
        if (user) {
        return user
    }}
    return null;
}

module.exports = searchUser