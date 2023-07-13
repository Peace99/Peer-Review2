import mongoose, {Schema}  from "mongoose";

const userSchema = mongoose.Schema({
  title: String,
  email: String, // String is shorthand for {type: String}
  name: String,
  password: String,
  department: String,
  fieldOfResearch: String,
});

export const userModel = mongoose.model('Users', userSchema);