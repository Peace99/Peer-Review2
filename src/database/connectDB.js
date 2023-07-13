import mongoose from "mongoose";

export const connectDB = async url => {
    mongoose
    .connect(url)
    .then(() => console.log("connection established"))
    .catch(err => console.log("connection error"))
}