const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const config = require("../utils/config");

jest.setTimeout(20000); // Increase timeout for MongoDB operations
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
// Create a supertest instance for making HTTP requests to the Express app
const api = supertest(app);
let token;

// Initial set of blogs to populate the database before each test
const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

// Test cases for the list helper functions to verify that they correctly calculate
//  total likes, identify the favorite blog, and determine the most prolific and
//  most liked authors
beforeAll(async () => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(config.MONGODB_URL);
  }

  // Clear the database before running the tests to ensure a clean state
  await User.deleteMany({});
  await Blog.deleteMany({});

  // Create a test user and obtain a token for authentication in the tests
  const passwordHash = await bcrypt.hash("sekret", 10);
  const testUser = new User({ username: "root", passwordHash });
  await testUser.save();
  // Log in with the test user to obtain a token for authenticated requests
  const loginResponse = await api
    .post("/api/login")
    .send({ username: "root", password: "sekret" });

  // Store the token for use in authenticated requests in the tests
  token = loginResponse.body.token;
}, 45000);

// Set up the database with initial blogs before each test
beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
}, 30000);

// Test cases for the blog API endpoints to verify that blogs are returned as JSON,
//  that all blogs are returned, that blogs have an id field, and that a valid blog
// can be added
test("All Blog are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(initialBlogs.length);
});

test("blogs have an id filed", async () => {
  const response = await api.get("/api/blogs");

  const blogs = response.body;

  expect(blogs).toHaveLength(initialBlogs.length);
  expect(blogs[0].id).toBeDefined();
  expect(blogs[0]._id).toBeUndefined();
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "New Blog Post",
    author: "John Doe",
    url: "http://example.com/new-blog-post",
    likes: 5,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  const titles = response.body.map((r) => r.title);
  expect(response.body).toHaveLength(initialBlogs.length + 1);
  expect(titles).toContain("New Blog Post");
});

test("adding a blog fail with a status code 401 if token is not provided", async () => {
  const newBlog = {
    title: "Blog without token",
    author: "Jane Doe",
    url: "http://example.com/blog-without-token",
    likes: 3,
  };
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(401)
    .expect("Content-Type", /application\/json/);
});

test("blog without likes defaults to 0", async () => {
  const newBlog = {
    title: "Blog without likes",
    author: "Jane Doe",
    url: "http://example.com/blog-without-likes",
  };
  const response = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  expect(response.body.likes).toBe(0);
}, 45000);

test("unique identifier is named id", async () => {
  const response = await api.get("/api/blogs");
  const blogs = response.body;
  expect(blogs[0].id).toBeDefined();
  expect(blogs[0]._id).toBeUndefined();
});

// Test that a blog can be deleted successfully
test("a blog can be deleted", async () => {
  const newBlog = {
    title: "Blog to delete",
    author: "Owner",
    url: "http://example.com/delete-me",
    likes: 1,
  };

  const createdBlog = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201);

  await api
    .delete(`/api/blogs/${createdBlog.body.id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(204);

  const blogsAfterDeletion = await api.get("/api/blogs");
  expect(blogsAfterDeletion.body).toHaveLength(initialBlogs.length);
  const titles = blogsAfterDeletion.body.map((r) => r.title);
  expect(titles).not.toContain(newBlog.title);
});

test("a blog can be updated (likes)", async () => {
  const response = await api.get("/api/blogs");
  const blogToUpdate = response.body[0];
  const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };
  await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(200);

  const blogsAfterUpdate = await api.get("/api/blogs");
  const updatedBlogInList = blogsAfterUpdate.body.find(
    (b) => b.id === blogToUpdate.id,
  );
  expect(updatedBlogInList.likes).toBe(updatedBlog.likes);
});

test("creation fails with proper status code and message if username is too short", async () => {
  const newUser = {
    username: "ab",
    name: "Short Username",
    password: "validpassword",
  };
  const response = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);
  expect(response.body.error).toContain(
    "username must be at least 3 characters long",
  );
});

test("creation fails with proper status code and message if password is too short", async () => {
  const newUser = {
    username: "validusername",
    name: "Short Password",
    password: "pw",
  };
  const response = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);
  expect(response.body.error).toContain(
    "Password must be at least 3 characters long",
  );
});

test("creation fails with proper status code and message if username is not unique", async () => {
  const newUser = {
    username: "root",
    name: "Duplicate Username",
    password: "validpassword",
  };
  const response = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);
  expect(response.body.error).toContain("Username must be unique");
});

// Close the Mongoose connection after all tests are done
afterAll(async () => {
  await mongoose.connection.close();
}, 45000);
