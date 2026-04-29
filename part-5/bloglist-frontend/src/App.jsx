// src/App.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import BlogList from "./components/BlogList";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import BlogDetails from "./components/BlogDetails.jsx";
import blogService from "./services/blogs";
import { Box, Typography, Button, Alert } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [user, setUser] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  useEffect(() => {
    blogService.setToken(user?.token);

    // Clear existing blogs and refetch when user changes (login/logout)
    setBlogs([]);
    if (user) {
      blogService.getAll().then((initialBlogs) => {
        setBlogs(initialBlogs.sort((a, b) => b.likes - a.likes));
      });
    }
  }, [user]);

  const showNotification = (message, type = "success") => {
    setNotificationMessage({ message, type });
    setTimeout(() => {
      setNotificationMessage(null);
    }, 5000);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("/api/login", {
        username,
        password,
      });

      const user = response.data;
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      setUser(user);
      setUsername("");
      setPassword("");

      showNotification(`Welcome ${user.name}!`, "success");
      navigate("/"); // Redirect to home page after login
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Login failed:", error);
      showNotification("Invalid username or password", "error");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    setUser(null);
    setBlogs([]); // Clear blogs from state on logout
    blogService.setToken(null); // Clear token from service
    showNotification("Logged out successfully", "success");
    navigate("/"); // Redirect to home page after logout
  };

  const updateBlogInState = (updatedBlog) => {
    setBlogs((prevBlogs) => {
      const newList = prevBlogs.map((blog) => {
        return blog.id === updatedBlog.id ? updatedBlog : blog;
      });
      return newList.sort((a, b) => b.likes - a.likes);
    });
  };

  const removeBlogFromState = (id) => {
    setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
  };

  return (
    <div>
      <Box
        sx={{
          backgroundColor: "#1976d2",
          padding: "25px 40px",
          boxShadow: 3,
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h3"
          sx={{ color: "white", fontWeight: 500, fontSize: "2.5em" }}
        >
          Blog App
        </Typography>

        <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
          <Link
            to="/"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "1.75em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            BLOGS
          </Link>

          {user && (
            <Link
              to="/create"
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: "1.75em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              NEW BLOG
            </Link>
          )}

          {user ? (
            <>
              <Button
                onClick={handleLogout}
                sx={{
                  color: "white",
                  fontSize: "1.75em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                LOGOUT
              </Button>
            </>
          ) : (
            <Link
              to="/login"
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: "1.75em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              LOGIN
            </Link>
          )}
        </Box>
      </Box>

      {notificationMessage && (
        <Alert
          severity={notificationMessage.type}
          sx={{
            mb: 3,
            mx: 5,
            fontSize: "1.5em",
            py: 2,
            px: 3,
          }}
          icon={<CheckCircleOutlineIcon fontSize="large" />}
        >
          {notificationMessage.message}
        </Alert>
      )}

      <Routes>
        <Route
          path="/login"
          element={
            <div>
              <h2>Log in to application</h2>
              <LoginForm
                username={username}
                password={password}
                setUsername={setUsername}
                setPassword={setPassword}
                handleLogin={handleLogin}
              />
            </div>
          }
        />
        <Route
          path="/"
          element={
            <BlogList
              blogs={blogs}
              user={user}
              showCreateForm={showCreateForm}
              setShowCreateForm={setShowCreateForm}
              updateBlogInState={updateBlogInState}
              removeBlogFromState={removeBlogFromState}
              createBlog={async (blog) => {
                const created = await blogService.create(blog);
                setBlogs(blogs.concat(created));
                setShowCreateForm(false);
                showNotification(
                  `A new blog '${blog.title}' by ${blog.author} added`,
                  "success",
                );
                navigate("/");
              }}
            />
          }
        />
        <Route
          path="/create"
          element={
            user ? (
              <BlogForm
                createBlog={async (blog) => {
                  const created = await blogService.create(blog);
                  setBlogs(blogs.concat(created));
                  showNotification(
                    `A new blog '${blog.title}' by ${blog.author} added`,
                    "success",
                  );
                  navigate("/");
                }}
                onCancel={() => navigate("/")}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/blogs/:id"
          element={
            <BlogDetails
              user={user}
              updateBlogInState={updateBlogInState}
              removeBlogFromState={(id) => {
                removeBlogFromState(id);
                showNotification("Blog deleted successfully", "success");
                navigate("/");
              }}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
