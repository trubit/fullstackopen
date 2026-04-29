import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import blogService from "../services/blogs";

export default function BlogDetails({
  user,
  updateBlogInState,
  removeBlogFromState,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    blogService
      .getById(id)
      .then((data) => {
        setBlog(data);
      })
      .catch((err) => {
        console.error("Error fetching blog:", err);
        setError("Blog not found");
      });
  }, [id]);

  const handleLike = async () => {
    if (!user || !blog) return;

    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user?.id || blog.user,
    };

    try {
      const response = await blogService.update(id, updatedBlog);
      // Preserve user object if backend only returns ID
      const blogWithUser = {
        ...response,
        user: response.user?.id ? response.user : blog.user,
      };
      setBlog(blogWithUser);
      if (updateBlogInState) {
        updateBlogInState(blogWithUser);
      }
    } catch (err) {
      console.error("Failed to like the blog:", err);
    }
  };

  const handleRemove = async () => {
    if (!blog) return;
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id);
        if (removeBlogFromState) {
          removeBlogFromState(blog.id);
        }
        navigate("/");
      } catch (error) {
        console.error("Failed to remove the blog:", error);
        alert(
          "Failed to remove the blog: " +
            (error.response?.data?.error || "Forbidden"),
        );
      }
    }
  };

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 3, md: 6 } }}>
        <Paper sx={{ p: 3, borderRadius: 3, border: "1px solid #ffcdd2" }}>
          <Typography color="error" sx={{ fontWeight: 700, mb: 2 }}>
            {error}
          </Typography>
          <Button variant="outlined" onClick={() => navigate("/")}>
            Back to blogs
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!blog) {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 3, md: 6 } }}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            border: "1px solid #dce6ff",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CircularProgress size={24} />
          <Typography sx={{ fontWeight: 600 }}>Loading blog...</Typography>
        </Paper>
      </Container>
    );
  }

  // Robust creator check
  const isCreator =
    user &&
    ((typeof blog.user === "string" && blog.user === user.id) ||
      (blog.user?.username && blog.user.username === user.username) ||
      (blog.user?.id && blog.user.id === user.id) ||
      (blog.user?._id && blog.user._id === user.id) ||
      (blog.user?.name && blog.user.name === user.name));

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
      <Paper
        elevation={5}
        sx={{
          position: "relative",
          overflow: "hidden",
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          border: "1px solid #dce6ff",
          background:
            "linear-gradient(135deg, #f9fbff 0%, #f1f6ff 55%, #fff8ef 100%)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: -60,
            right: -60,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "rgba(25, 118, 210, 0.14)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -70,
            left: -70,
            width: 190,
            height: 190,
            borderRadius: "50%",
            background: "rgba(245, 124, 0, 0.1)",
          },
        }}
      >
        <Stack spacing={3} sx={{ position: "relative", zIndex: 1 }}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                lineHeight: 1.1,
                fontSize: { xs: "2rem", md: "2.8rem" },
              }}
            >
              {blog.title}
            </Typography>
            <Typography
              sx={{
                mt: 1,
                color: "text.secondary",
                fontSize: { xs: "1.15rem", md: "1.35rem" },
              }}
            >
              by {blog.author}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "rgba(255, 255, 255, 0.85)",
              border: "1px solid #d4e0fb",
            }}
          >
            <Typography
              sx={{ fontWeight: 700, color: "#0d47a1", mb: 0.5, fontSize: 14 }}
            >
              Read More
            </Typography>
            <Link
              href={blog.url}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ fontSize: { xs: "1rem", md: "1.1rem" }, wordBreak: "break-all" }}
            >
              {blog.url}
            </Link>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.2}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Typography sx={{ color: "text.secondary", fontWeight: 500 }}>
              Added by
            </Typography>
            <Chip
              label={blog.user?.name || blog.user?.username || blog.author}
              sx={{
                fontWeight: 700,
                bgcolor: "#eaf2ff",
                color: "#0d47a1",
                border: "1px solid #bbd3ff",
              }}
            />
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <Chip
              label={`${blog.likes} likes`}
              sx={{
                fontSize: "1rem",
                fontWeight: 800,
                bgcolor: "#1e293b",
                color: "#ffffff",
                py: 2,
              }}
            />

            {user && (
              <Button
                onClick={handleLike}
                variant="contained"
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  bgcolor: "#1976d2",
                  "&:hover": { bgcolor: "#115293" },
                }}
              >
                Like
              </Button>
            )}

            {isCreator && (
              <Button
                onClick={handleRemove}
                variant="outlined"
                color="error"
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  borderWidth: 2,
                }}
              >
                Remove
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
