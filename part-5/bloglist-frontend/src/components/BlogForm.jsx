import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

const BlogForm = ({ createBlog, onCancel }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    createBlog({ title, author, url });
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <Box sx={{ ml: 6, mt: 6, width: "550px" }}>
      <Typography variant="h3" sx={{ mb: 3, fontSize: "2.5em" }}>
        create new
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          id="title"
          label="title"
          type="text"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          sx={{
            mb: 2,
            "& .MuiInputBase-input": { fontSize: "1.5em", padding: "15px" },
            "& .MuiInputLabel-root": { fontSize: "1.5em" },
          }}
        />

        <TextField
          id="author"
          label="author"
          type="text"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          sx={{
            mb: 2,
            "& .MuiInputBase-input": { fontSize: "1.5em", padding: "15px" },
            "& .MuiInputLabel-root": { fontSize: "1.5em" },
          }}
        />

        <TextField
          id="url"
          label="url"
          type="text"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          sx={{
            mb: 3,
            "& .MuiInputBase-input": { fontSize: "1.5em", padding: "15px" },
            "& .MuiInputLabel-root": { fontSize: "1.5em" },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{
            py: 2,
            px: 4,
            fontSize: "1.5em",
            textTransform: "uppercase",
            boxShadow: 3,
            mr: 2,
            mt: 1,
          }}
        >
          CREATE
        </Button>

        <Button
          type="button"
          variant="contained"
          color="inherit"
          size="large"
          onClick={onCancel}
          sx={{
            py: 2,
            px: 4,
            fontSize: "1.5em",
            textTransform: "uppercase",
            boxShadow: 1,
            mt: 1,
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default BlogForm;
