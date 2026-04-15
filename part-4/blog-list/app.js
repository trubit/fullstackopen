// Main application file for the blog list backend using Express.js
const express = require("express");
const cors = require("cors");

// Importing custom middleware and route handlers
const {
  tokenExtractor,
  errorHandler,
  userExtractor,
} = require("./utils/middleware");
const logger = require("./utils/logger");
const blogsRouter = require("./controllers/blogs");
const userRouter = require("./controllers/user");
const loginRouter = require("./controllers/login");

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);
app.use(tokenExtractor);

// Routes
app.use("/api/blogs", userExtractor, blogsRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);

// Error handling middleware should be the last middleware added to the app
app.use(errorHandler);

module.exports = app;
