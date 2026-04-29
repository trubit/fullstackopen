import { TextField, Button, Box } from "@mui/material";

const LoginForm = ({
  username,
  password,
  setUsername,
  setPassword,
  handleLogin,
}) => {
  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{ ml: 6, mt: 6, width: "350px" }}
    >
      <TextField
        id="username"
        label="username"
        type="text"
        value={username}
        onChange={({ target }) => setUsername(target.value)}
        fullWidth
        margin="normal"
        variant="standard"
        sx={{
          mb: 3,
          fontSize: "1.5em",
          "& .MuiInputBase-input": { fontSize: "1.5em" },
          "& .MuiInputLabel-root": { fontSize: "1.5em" },
        }}
      />

      <TextField
        id="password"
        label="password"
        type="password"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
        fullWidth
        margin="normal"
        variant="standard"
        sx={{
          mb: 3,
          "& .MuiInputBase-input": { fontSize: "1.5em" },
          "& .MuiInputLabel-root": { fontSize: "1.5em" },
        }}
      />

      <Button
        id="login-button"
        type="submit"
        variant="contained"
        size="large"
        sx={{
          py: 2,
          px: 4,
          fontSize: "1.5em",
          textTransform: "uppercase",
          boxShadow: 3,
        }}
      >
        LOGIN
      </Button>
    </Box>
  );
};

export default LoginForm;
