const bcrypt = require("bcrypt");
const User = require("../models/user");
const userRouter = require("express").Router();

// Get all users
userRouter.get("/", async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// Create a new user
userRouter.post("/", async (req, res) => {
  try {
    const { username, name, password } = req.body;
    // Validate username
    if (!username || username.length < 3) {
      return res
        .status(400)
        .json({ error: "username must be at least 3 characters long" });
    }
    // Validate password
    if (!password || password.length < 3) {
      return res
        .status(400)
        .json({ error: "Password must be at least 3 characters long" });
    }

    // Check for unique username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username must be unique" });
    }
    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    // Create and save the user
    const user = new User({ username, name, passwordHash });
    // Save the user and return the response
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = userRouter;
