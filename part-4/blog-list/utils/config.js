require("dotenv").config();
// Configuration for MongoDB URL and server port
const PORT = process.env.PORT || 3003;

// Determine the MongoDB URL based on the environment (test or production)
const MONGODB_URL =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URL;

module.exports = {
  MONGODB_URL,
  PORT,
};
