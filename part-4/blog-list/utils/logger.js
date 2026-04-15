// Middleware for logging HTTP requests in Express.js applications
const logger = (req, res, next) => {
  console.log(req.method, req.path);
  next();
};

module.exports = logger;
