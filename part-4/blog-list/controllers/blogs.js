// Controller for handling blog-related routes in the blog list application using Express.js and MongoDB
const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// Get all blogs with populated user information
router.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user");
  res.json(blogs);
});

// Create a new blog post and associate it with the first user in the database
router.post("/", async (req, res) => {
  const body = req.body;

  // Extract the user from the request using the userExtractor middleware
  const user = req.user;

  // If no user is found in the request, return a 401 error
  if (!user) {
    return res.status(401).json({ error: "user not found" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id, // Associate the blog with the first user
  });
  // Save the new blog post to the database
  const savedBlog = await blog.save();
  // Populate the user field in the saved blog before sending the response
  const populatedBlog = await savedBlog.populate("user");
  res.status(201).json(populatedBlog);
});

// Get a single blog by ID
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a blog by ID
router.put("/:id", async (req, res) => {
  const { title, author, url, likes } = req.body;
  try {
    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, author, url, likes },
      { new: true, runValidators: true },
    ).populate("user", { username: 1, name: 1 });
    if (!updated) return res.status(404).json({ error: "Blog not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a blog by ID with authentication and ownership verification
router.delete("/:id", async (req, res) => {
  // Extract the user from the request using the userExtractor middleware
  const user = req.user;
  // If no user is found in the request, return a 401 error
  if (!user) {
    return res.status(401).json({ error: "user not found" });
  }

  // Find the blog post by ID to check if it exists and to verify ownership
  const blog = await Blog.findById(req.params.id);

  // If the blog does not exist, return a 404 error
  if (!blog) {
    return res.status(404).json({ error: "blog not found" });
  }
  // Check if the user associated with the blog matches the user ID from the decoded token
  if (!blog.user || blog.user.toString() !== user._id.toString()) {
    return res.status(403).json({ error: "forbidden: not the blog owner" });
  }

  // If the user is the owner, proceed to delete the blog post
  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

// Export the router to be used in the main application
module.exports = router;
