const mongoose = require("mongoose");

const connectToDatabase = async (mongoUrl) => {
  if (!mongoUrl) {
    throw new Error("MONGODB_URL is not defined");
  }

  mongoose.set("strictQuery", false);
  await mongoose.connect(mongoUrl);
  return mongoose.connection;
};

module.exports = { connectToDatabase };
