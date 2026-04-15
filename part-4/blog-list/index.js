// Entry point for the blog list backend application using Express.js and MongoDB
const mongoose = require("mongoose");
const app = require("./app");
const config = require("./utils/config");

const PORT = config.PORT || 3003;

// Connect to MongoDB and start the server
mongoose
  .connect(config.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });
