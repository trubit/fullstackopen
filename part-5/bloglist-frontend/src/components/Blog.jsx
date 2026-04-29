import { useState } from "react";
import { Link } from "react-router-dom";
import blogService from "../services/blogs";

const Blog = ({
  blog,
  user,
  updateBlogInState,
  removeBlogFromState,
  handleLike: handleLikeProp,
}) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    border: "1px solid #d7e1f7",
    borderRadius: "14px",
    padding: "16px 18px",
    marginBottom: "14px",
    background: "linear-gradient(145deg, #ffffff 0%, #f5f9ff 100%)",
    boxShadow: "0 8px 20px rgba(17, 24, 39, 0.08)",
  };

  const titleRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  };

  const titleLinkStyle = {
    textDecoration: "none",
    color: "#0f172a",
    fontSize: "1.2rem",
    fontWeight: 800,
  };

  const authorStyle = {
    color: "#475569",
    fontWeight: 600,
    marginLeft: "6px",
  };

  const toggleBtnStyle = {
    border: "1px solid #2563eb",
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
    borderRadius: "8px",
    padding: "5px 12px",
    fontWeight: 700,
    cursor: "pointer",
  };

  const detailsStyle = {
    marginTop: "14px",
    borderTop: "1px dashed #bfdbfe",
    paddingTop: "12px",
    display: "grid",
    gap: "10px",
    justifyItems: "start",
  };

  const actionRowStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  };

  const likeBtnStyle = {
    border: "2px solid #9ac5f3",
    backgroundColor: "#ffffff",
    color: "#3b82d1",
    borderRadius: "7px",
    padding: "8px 22px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.02em",
    cursor: "pointer",
    width: "auto",
  };

  const removeBtnStyle = {
    border: "2px solid #f1aaaa",
    backgroundColor: "#ffffff",
    color: "#e45858",
    borderRadius: "7px",
    padding: "8px 22px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.02em",
    cursor: "pointer",
    width: "auto",
  };

  const handleLike = async () => {
    if (handleLikeProp) {
      handleLikeProp();
      return;
    }
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user?.id || blog.user,
    };
    try {
      const response = await blogService.update(blog.id, updatedBlog);
      // Preserve user object if backend only returns ID
      const blogWithUser = {
        ...response,
        user: response.user?.id ? response.user : blog.user,
      };
      updateBlogInState(blogWithUser);
    } catch (error) {
      console.error("Failed to like the blog:", error);
    }
  };

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id);
        removeBlogFromState(blog.id);
      } catch (error) {
        console.error("Failed to remove the blog:", error);
        const errorMessage =
          error.response?.data?.error || error.message || "Forbidden";
        alert(`Failed to remove the blog: ${errorMessage}`);
      }
    }
  };

  // Robust creator check
  const isCreator =
    user &&
    ((typeof blog.user === "string" && blog.user === user.id) ||
      (blog.user?.username && blog.user.username === user.username) ||
      (blog.user?.id && blog.user.id === user.id) ||
      (blog.user?._id && blog.user._id === user.id) ||
      (blog.user?.name && blog.user.name === user.name));

  return (
    <div style={blogStyle} className="blog-item">
      <div style={titleRowStyle}>
        <div>
          <Link to={`/blogs/${blog.id}`} style={titleLinkStyle}>
            {blog.title}
          </Link>{" "}
          <span style={authorStyle}>{blog.author}</span>
        </div>
        <button onClick={() => setVisible(!visible)} style={toggleBtnStyle}>
          {visible ? "hide" : "view"}
        </button>
      </div>
      {visible && (
        <div className="blog-details-expanded" style={detailsStyle}>
          <a
            href={blog.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#1d4ed8",
              fontWeight: 600,
              wordBreak: "break-all",
            }}
          >
            {blog.url}
          </a>
          <div style={actionRowStyle}>
            <span style={{ fontWeight: 700 }}>likes {blog.likes}</span>
            {user && (
              <button
                onClick={handleLike}
                className="like-button"
                style={likeBtnStyle}
              >
                LIKE
              </button>
            )}
          </div>
          <div style={{ color: "#475569", fontWeight: 600 }}>
            Added by {blog.user?.name || blog.user?.username || blog.author}
          </div>
          {isCreator && (
            <button
              onClick={handleRemove}
              style={removeBtnStyle}
              className="remove-button"
            >
              REMOVE
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
