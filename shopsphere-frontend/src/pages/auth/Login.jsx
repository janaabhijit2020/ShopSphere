import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { login } from "../../services/authService";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData((previousData) => ({
      ...previousData,
      [event.target.name]: event.target.value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await login(formData);

      const {
        token,
        email,
        role,
      } = response.data;

      // Save login information
      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "email",
        email
      );

      localStorage.setItem(
        "role",
        role
      );

      // Convert role to uppercase
      const userRole =
        role?.toUpperCase();

      // Role-based success message
      if (userRole === "ADMIN") {
        setSuccess(
          "Admin login successful! Redirecting to Admin Dashboard..."
        );

        setTimeout(() => {
          navigate(
            "/admin/dashboard",
            {
              replace: true,
            }
          );
        }, 1000);
      } else {
        setSuccess(
          "Login successful! Redirecting to Home..."
        );

        setTimeout(() => {
          navigate(
            "/",
            {
              replace: true,
            }
          );
        }, 1000);
      }
    } catch (error) {
      console.error(
        "Login failed:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        py: 8,
      }}
    >
      <Paper
        elevation={5}
        sx={{
          p: {
            xs: 3,
            sm: 5,
          },
          borderRadius: 4,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          align="center"
          color="primary"
          gutterBottom
        >
          ShopSphere
        </Typography>

        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{
            mb: 4,
          }}
        >
          Login to your account
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
            }}
            onClose={() =>
              setError("")
            }
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
            }}
          >
            {success}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={
            handleLogin
          }
        >
          <Stack spacing={3}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              required
              fullWidth
              disabled={
                loading
              }
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              required
              fullWidth
              disabled={
                loading
              }
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={
                loading
              }
              sx={{
                py: 1.4,
                borderRadius: 2,
                textTransform:
                  "none",
                fontWeight:
                  "bold",
              }}
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </Button>

            <Typography
              align="center"
            >
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  textDecoration:
                    "none",
                  fontWeight:
                    "bold",
                }}
              >
                Register
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;