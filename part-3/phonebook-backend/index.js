// Import Express (a web framework for Node.js)
const express = require("express");
// Load environment variables from .env
require("dotenv").config();
// Import CORS middleware to enable Cross-Origin Resource Sharing
const cors = require("cors");
// Import Morgan (HTTP request logger middleware)
const morgan = require("morgan");
// Import the built-in 'path' module to work with file and directory paths
const path = require("path");
// Database connection (Mongoose-specific code lives in mongo.js)
const { connectToDatabase } = require("./mongo");
// Mongoose model for people
const Person = require("./models/person");
// Create the Express app instance
const app = express();
// Serve static files from the "dist" directory (for frontend)
app.use(express.static("dist"));

// Middleware: enable CORS for all routes
app.use(cors());
// Middleware: parse incoming JSON request bodies into req.body
app.use(express.json());
// Define a custom token in Morgan to log the request body as JSON
morgan.token("body", (req) => JSON.stringify(req.body));
// Middleware: log HTTP requests using Morgan with a custom format that includes the request body
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

// Create a new person
app.post("/api/persons", async (req, res, next) => {
  // Read the JSON body sent by the client
  const body = req.body;

  // Validate that both name and number are provided
  if (!body.name || !body.number) {
    // If name or number is missing, return 400 Bad Request with an error message
    return res.status(400).json({ error: "name or number is missing" });
  }

  if (body.name.length < 3) {
    return res
      .status(400)
      .json({ error: "name must be at least 3 characters long" });
  }

  try {
    // Build a new person object from the request
    const newPerson = new Person({
      name: body.name,
      number: body.number,
    });

    // Save and return the created person
    const savedPerson = await newPerson.save();
    res.json(savedPerson);
  } catch (error) {
    next(error);
  }
});

// Get all persons
app.get("/api/persons", async (_req, res, next) => {
  try {
    const people = await Person.find({});
    res.json(people);
  } catch (error) {
    next(error);
  }
});

// Get general info about the phonebook
app.get("/api/info", async (_req, res, next) => {
  try {
    const totalPersons = await Person.countDocuments({});
    const date = new Date();

    res.send(`
      <p>Phonebook has info for ${totalPersons} people</p>
      <p>${date}</p>
    `);
  } catch (error) {
    next(error);
  }
});

// Get one person by id
app.get("/api/persons/:id", async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id);
    person ? res.json(person) : res.status(404).end();
  } catch (error) {
    next(error);
  }
});

// Update one person by id
app.put("/api/persons/:id", async (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: "name or number is missing" });
  }

  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      { name: body.name, number: body.number },
      { new: true, runValidators: true, context: "query" },
    );
    updatedPerson ? res.json(updatedPerson) : res.status(404).end();
  } catch (error) {
    next(error);
  }
});

// Delete one person by id
app.delete("/api/persons/:id", async (req, res, next) => {
  try {
    const deletedPerson = await Person.findByIdAndDelete(req.params.id);
    deletedPerson ? res.status(204).end() : res.status(404).end();
  } catch (error) {
    next(error);
  }
});

// Serve React/Vite frontend for any unknown route (SPA fallback)
app.get("/*splat", (_req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

// Error handling middleware
const errorHandler = (error, _req, res, _next) => {
  if (error.name === "CastError") {
    return res.status(400).json({ error: "malformatted id" });
  }
  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  console.error(error);
  res.status(500).json({ error: "internal server error" });
};

app.use(errorHandler);

// The port the server will listen on
const PORT = process.env.PORT || 3001;

// Start the server
connectToDatabase(process.env.MONGODB_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  });
