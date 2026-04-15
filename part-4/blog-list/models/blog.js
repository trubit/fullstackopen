const mongoose = require("mongoose");
// Mongoose schema and model for blog posts in the blog list application
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: String,
  url: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },

  // Reference to the User model to associate blogs with users
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// Transform the returned JSON object to replace _id with id and remove __v
blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
// Export the Mongoose model for use in other parts of the application
module.exports = mongoose.model("Blog", blogSchema);
