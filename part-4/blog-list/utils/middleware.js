// Middleware for error handling in Express.js applications
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Middleware function to extract the token from the Authorization header of incoming requests
const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    req.token = authorization.substring(7);
  } else {
    req.token = null;
  }
  next();
};
// Middleware function to extract the user from the token and attach it to the request object
const userExtractor = async (req, res, next) => {
  if (req.token) {
    try {
      const decodedToken = jwt.verify(req.token, process.env.SECRET);
      const user = await User.findById(decodedToken.id);
      req.user = user || null;
    } catch (err) {
      req.user = null;
    }
  } else {
    req.user = null;
  }

  next();
};

// Error handling middleware that logs the error message and sends a JSON response with the error
const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  res.status(400).json({
    error: err.message,
  });
};

// Export the middleware functions for use in other parts of the application
module.exports = { tokenExtractor, errorHandler, userExtractor };
