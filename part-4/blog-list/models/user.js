const mongoose = require("mongoose");

// Mongoose schema and model for users in the blog list application
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  name: String,
  passwordHash: String,
});

// Transform the returned JSON object to replace _id with id and remove __v and passwordHash
userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash; // Do not return the password hash
  },
});

// Create and export the Mongoose model for users
const User = mongoose.model("User", userSchema);

module.exports = User;
