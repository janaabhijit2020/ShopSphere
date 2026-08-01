import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import {
  changePassword,
  getMyProfile,
  updateProfile,
} from "../services/profileService";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });

  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordSaving, setPasswordSaving] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setProfileLoading(true);
      setError("");

      const response = await getMyProfile();

      setProfile({
        firstName: response.data.firstName || "",
        lastName: response.data.lastName || "",
        email: response.data.email || "",
        role: response.data.role || "",
      });
    } catch (error) {
      console.error("Failed to load profile:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load your profile."
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((previousProfile) => ({
      ...previousProfile,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    try {
      setProfileSaving(true);
      setError("");
      setSuccess("");

      const response = await updateProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
      });

      setProfile((previousProfile) => ({
        ...previousProfile,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
      }));

      setSuccess("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update profile:", error);

      setError(
        error.response?.data?.message ||
          "Unable to update your profile."
      );
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must contain at least 6 characters.");
      return;
    }

    try {
      setPasswordSaving(true);

      await changePassword(
        oldPassword,
        newPassword
      );

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setSuccess("Password changed successfully.");
    } catch (error) {
      console.error("Failed to change password:", error);

      setError(
        error.response?.data?.message ||
          "Unable to change password."
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

  if (profileLoading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const initials = `${profile.firstName?.charAt(0) || ""}${
    profile.lastName?.charAt(0) || ""
  }`.toUpperCase();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, md: 5 },
        backgroundColor: "#f5f7fb",
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ mb: 1 }}
        >
          My Profile
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Manage your account information and password.
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
            onClose={() => setSuccess("")}
          >
            {success}
          </Alert>
        )}

        <Paper
          elevation={2}
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: 3,
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 4,
            }}
          >
            <Avatar
              sx={{
                width: 70,
                height: 70,
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              {initials || "U"}
            </Avatar>

            <Box>
              <Typography
                variant="h6"
                fontWeight="bold"
              >
                {profile.firstName} {profile.lastName}
              </Typography>

              <Typography color="text.secondary">
                {profile.email}
              </Typography>

              <Typography
                variant="body2"
                color="primary"
                sx={{ mt: 0.5 }}
              >
                {profile.role}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mb: 3 }}
          >
            Personal Information
          </Typography>

          <Box
            component="form"
            onSubmit={handleProfileSubmit}
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="First Name"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleProfileChange}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="Last Name"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleProfileChange}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  value={profile.email}
                  disabled
                  helperText="Email cannot be changed."
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              disabled={profileSaving}
              sx={{
                mt: 3,
                px: 4,
                py: 1.2,
              }}
            >
              {profileSaving
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </Box>
        </Paper>

        <Paper
          elevation={2}
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: 3,
            mb: 4,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mb: 1 }}
          >
            Change Password
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Use a strong password that you do not use
            elsewhere.
          </Typography>

          <Box
            component="form"
            onSubmit={handlePasswordSubmit}
          >
            <TextField
              fullWidth
              required
              type="password"
              label="Current Password"
              value={oldPassword}
              onChange={(event) =>
                setOldPassword(event.target.value)
              }
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              required
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(event.target.value)
              }
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              required
              type="password"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
            />

            <Button
              type="submit"
              variant="contained"
              disabled={passwordSaving}
              sx={{
                mt: 3,
                px: 4,
                py: 1.2,
              }}
            >
              {passwordSaving
                ? "Changing Password..."
                : "Change Password"}
            </Button>
          </Box>
        </Paper>

        <Paper
          elevation={1}
          sx={{
            p: { xs: 2.5, sm: 3 },
            borderRadius: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box>
            <Typography fontWeight="bold">
              Sign out
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Sign out from your ShopSphere account.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

export default Profile;